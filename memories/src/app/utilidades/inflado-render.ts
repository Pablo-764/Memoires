/**
 * Objeto inflado cubierto de texto (sin Angular, para poder moverlo a un worker).
 *
 * 1. Máscara 2D de la forma y, por cada fila, sus tramos internos.
 * 2. Altura por píxel según la distancia al borde (inflado) y su gradiente como normal.
 * 3. Textura de texto en un canvas aparte: frente y reverso espejado.
 * 4. Giro sobre Y: cada fila del objeto cae en la misma fila de pantalla.
 *    sx = X·cos + Z·sin + C; profundidad = −X·sin + Z·cos (Z = +z frente, −z reverso).
 * 5. Brillo de cromo: luz difusa, reflejo especular y borde Fresnel (rim = 1 − |nz|).
 * 6. Se pinta por profundidad con un búfer por fila (frente y reverso), así no quedan huecos al girar.
 * 7. Versión ASCII: la pantalla se parte en celdas; cada celda muestra la letra de las frases que
 *    cae en ese punto de la superficie y toma el color de su luz. Así el texto se lee entero.
 */

export type InfladoShape = 'heart' | 'cup' | 'ticket' | 'star'

export interface InfladoColors {
  // Cuerpo de cromo: de la sombra a la luz
  body0: string
  body1: string
  // Reflejo y borde
  rim: string
  // Color del texto que lo cubre
  text: string
}

type RGB = [number, number, number]

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

// Formas en coordenadas de -1 a 1 (y hacia arriba)
function inside(shape: InfladoShape, x: number, y: number): boolean {
  switch (shape) {
    case 'heart': {
      const X = x * 1.18
      const Y = (y + 0.12) * 1.18
      const a = X * X + Y * Y - 1
      return a * a * a - X * X * Y * Y * Y <= 0
    }
    case 'cup': {
      // Cuerpo con fondo redondeado y asa de aro a la derecha
      const bx = x + 0.14
      const body = Math.abs(bx) <= 0.62 && y <= 0.62 && y >= -0.25
      const bottom = bx * bx / (0.62 * 0.62) + (y + 0.25) * (y + 0.25) / (0.55 * 0.55) <= 1 && y < -0.25
      const hx = x - 0.62
      const r = Math.hypot(hx, y - 0.12)
      const handle = r >= 0.16 && r <= 0.34 && hx > 0
      return body || bottom || handle
    }
    case 'ticket': {
      const w = 0.95
      const h = 0.56
      const rr = 0.14
      const qx = Math.max(Math.abs(x) - (w - rr), 0)
      const qy = Math.max(Math.abs(y) - (h - rr), 0)
      if (qx * qx + qy * qy > rr * rr) return false
      if (Math.hypot(Math.abs(x) - w, y) < 0.2) return false
      return true
    }
    case 'star': {
      const r = Math.hypot(x, y)
      const t = Math.atan2(y, x) + Math.PI / 2
      const k = 0.62 + 0.3 * Math.cos(5 * t)
      return r <= k
    }
  }
}

export function parseColor(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, c: string): RGB {
  ctx.fillStyle = '#000'
  ctx.fillStyle = c
  const v = String(ctx.fillStyle)
  if (v.startsWith('#')) return [parseInt(v.slice(1, 3), 16), parseInt(v.slice(3, 5), 16), parseInt(v.slice(5, 7), 16)]
  const m = v.match(/[\d.]+/g)
  return m ? [+m[0], +m[1], +m[2]] : [0, 0, 0]
}

export class InfladoRenderer {
  private readonly n: number
  private readonly ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
  private readonly img: ImageData
  private readonly tex: OffscreenCanvas | HTMLCanvasElement
  private readonly tctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
  private texAlpha = new Uint8ClampedArray(0)
  private height = new Float32Array(0)
  private nx = new Float32Array(0)
  private ny = new Float32Array(0)
  private spans: number[][] = []
  private colors = { b0: [200, 180, 240] as RGB, b1: [110, 62, 173] as RGB, rim: [254, 252, 248] as RGB, text: [147, 80, 108] as RGB }
  private shape: InfladoShape = 'heart'
  private phrases: string[] = []
  private textFill = -1
  private readonly zbuf: Float32Array
  // Por píxel de pantalla: qué punto del objeto se ve (k + 1, negativo si es el reverso) y su luz
  private readonly obj: Int32Array
  private readonly lit: Float32Array

  constructor(canvas: HTMLCanvasElement | OffscreenCanvas, size = 240) {
    this.n = size
    canvas.width = size
    canvas.height = size
    this.ctx = canvas.getContext('2d', { willReadFrequently: false }) as CanvasRenderingContext2D
    this.img = this.ctx.createImageData(size, size)
    this.tex = typeof OffscreenCanvas !== 'undefined' ? new OffscreenCanvas(size, size) : Object.assign(document.createElement('canvas'), { width: size, height: size })
    this.tctx = this.tex.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D
    this.zbuf = new Float32Array(size)
    this.obj = new Int32Array(size * size)
    this.lit = new Float32Array(size * size)
  }

  setColors(c: InfladoColors) {
    const ctx = this.tctx
    this.colors = { b0: parseColor(ctx, c.body0), b1: parseColor(ctx, c.body1), rim: parseColor(ctx, c.rim), text: parseColor(ctx, c.text) }
  }

  setPhrases(list: string[]) {
    this.phrases = list.length ? list : ['mémoires']
    this.textFill = -1
  }

  setShape(shape: InfladoShape) {
    this.shape = shape
    const n = this.n
    const mask = new Uint8Array(n * n)
    const margin = 0.08
    for (let j = 0; j < n; j++) {
      const y = 1 - ((j + 0.5) / n) * 2
      for (let i = 0; i < n; i++) {
        const x = ((i + 0.5) / n) * 2 - 1
        mask[j * n + i] = inside(shape, x / (1 - margin), y / (1 - margin)) ? 1 : 0
      }
    }
    // Distancia al borde (chaflán en dos pasadas)
    const INF = 1e9
    const d = new Float32Array(n * n)
    for (let k = 0; k < n * n; k++) d[k] = mask[k] ? INF : 0
    const D1 = 1
    const D2 = Math.SQRT2
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        const k = j * n + i
        if (!d[k]) continue
        let v = d[k]
        if (i > 0) v = Math.min(v, d[k - 1] + D1)
        if (j > 0) {
          v = Math.min(v, d[k - n] + D1)
          if (i > 0) v = Math.min(v, d[k - n - 1] + D2)
          if (i < n - 1) v = Math.min(v, d[k - n + 1] + D2)
        }
        if (i === 0 || j === 0 || i === n - 1 || j === n - 1) v = Math.min(v, 1)
        d[k] = v
      }
    }
    for (let j = n - 1; j >= 0; j--) {
      for (let i = n - 1; i >= 0; i--) {
        const k = j * n + i
        if (!d[k]) continue
        let v = d[k]
        if (i < n - 1) v = Math.min(v, d[k + 1] + D1)
        if (j < n - 1) {
          v = Math.min(v, d[k + n] + D1)
          if (i < n - 1) v = Math.min(v, d[k + n + 1] + D2)
          if (i > 0) v = Math.min(v, d[k + n - 1] + D2)
        }
        d[k] = v
      }
    }
    // Suaviza la distancia (tres pasadas de caja) para que no queden aristas en el lomo
    const rad = Math.max(2, Math.round(n / 36))
    const tmp = new Float32Array(n * n)
    for (let pass = 0; pass < 3; pass++) {
      for (let j = 0; j < n; j++) {
        let acc = 0
        for (let i = -rad; i < n + rad; i++) {
          if (i + rad < n) acc += d[j * n + i + rad]
          if (i - rad - 1 >= 0) acc -= d[j * n + i - rad - 1]
          if (i >= 0 && i < n) tmp[j * n + i] = acc / (2 * rad + 1)
        }
      }
      for (let i = 0; i < n; i++) {
        let acc = 0
        for (let j = -rad; j < n + rad; j++) {
          if (j + rad < n) acc += tmp[(j + rad) * n + i]
          if (j - rad - 1 >= 0) acc -= tmp[(j - rad - 1) * n + i]
          if (j >= 0 && j < n) d[j * n + i] = mask[j * n + i] ? acc / (2 * rad + 1) : 0
        }
      }
    }
    let max = 1
    for (let k = 0; k < n * n; k++) if (d[k] > max) max = d[k]
    // Perfil de globo: sube rápido cerca del borde y se aplana arriba
    const h = new Float32Array(n * n)
    const R = max
    for (let k = 0; k < n * n; k++) {
      if (!d[k]) continue
      const t = Math.min(1, d[k] / R)
      h[k] = Math.sqrt(1 - (1 - t) * (1 - t)) * R * 0.9
    }
    // Normales por gradiente
    const nx = new Float32Array(n * n)
    const ny = new Float32Array(n * n)
    for (let j = 1; j < n - 1; j++) {
      for (let i = 1; i < n - 1; i++) {
        const k = j * n + i
        if (!mask[k]) continue
        nx[k] = (h[k - 1] - h[k + 1]) / 2
        ny[k] = (h[k + n] - h[k - n]) / 2
      }
    }
    this.height = h
    this.nx = nx
    this.ny = ny
    this.spans = []
    for (let j = 0; j < n; j++) {
      const row: number[] = []
      let start = -1
      for (let i = 0; i <= n; i++) {
        const on = i < n && mask[j * n + i] === 1
        if (on && start < 0) start = i
        if (!on && start >= 0) {
          row.push(start, i - 1)
          start = -1
        }
      }
      this.spans.push(row)
    }
    this.textFill = -1
  }

  /** Dibuja las frases como renglones; `fill` (0 a 1) es cuánto texto ya se escribió. */
  private paintText(fill: number) {
    const q = Math.round(fill * 400) / 400
    if (q === this.textFill) return
    this.textFill = q
    const n = this.n
    const c = this.tctx
    c.clearRect(0, 0, n, n)
    const fs = Math.max(7, Math.round(n / 23))
    c.font = `700 ${fs}px "Space Mono", ui-monospace, monospace`
    c.textBaseline = 'middle'
    c.fillStyle = '#fff'
    const rows = Math.floor(n / (fs * 1.15))
    const text = this.phrases.join('  ·  ') + '  ·  '
    const perRow = Math.ceil(n / (fs * 0.6)) + 2
    let total = Math.floor(rows * perRow * q)
    let offset = 0
    for (let r = 0; r < rows && total > 0; r++) {
      const take = Math.min(perRow, total)
      let line = ''
      while (line.length < take) {
        line += text.slice((offset + line.length) % text.length, text.length).slice(0, take - line.length)
      }
      offset = (offset + perRow * 0.37) | 0
      c.fillText(line.slice(0, take), -fs * 0.3 * (r % 3), (r + 0.5) * fs * 1.15)
      total -= take
    }
    const data = c.getImageData(0, 0, n, n).data
    const a = new Uint8ClampedArray(n * n)
    for (let k = 0; k < n * n; k++) a[k] = data[k * 4 + 3]
    this.texAlpha = a
  }

  /**
   * Pinta un cuadro.
   * @param angle giro sobre Y en radianes
   * @param fill cuánto texto se ha escrito (0 a 1)
   * @param inflate cuánto aire tiene (0 plano, 1 inflado)
   */
  render(angle: number, fill = 1, inflate = 1, draw = true) {
    if (draw) this.paintText(fill)
    const n = this.n
    const px = this.img.data
    px.fill(0)
    this.obj.fill(0)
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    const C = n / 2
    const { b0, b1, rim: rc, text: tc } = this.colors
    const tex = this.texAlpha
    const h = this.height
    // Luz arriba a la izquierda, al frente
    const lx = -0.45
    const ly = 0.55
    const lz = 0.7
    // Escala vertical para que al desinflarse el objeto se achate un poco
    const squash = 0.82 + 0.18 * inflate
    for (let j = 0; j < n; j++) {
      const row = this.spans[j]
      if (!row.length) continue
      const sj = Math.round(C + (j - C) * squash)
      if (sj < 0 || sj >= n) continue
      this.zbuf.fill(-1e9)
      for (let face = 0; face < 2; face++) {
        const side = face === 0 ? 1 : -1
        for (let s = 0; s < row.length; s += 2) {
          const i0 = row[s]
          const i1 = row[s + 1]
          let prevX = -1
          for (let i = i0; i <= i1; i++) {
            const k = j * n + i
            const X = i - C
            const Z = h[k] * inflate * side
            let gx = this.nx[k] * inflate
            const gy = this.ny[k] * inflate
            let gz = 1
            if (side < 0) gx = -gx
            const len = Math.hypot(gx, gy, gz)
            gx /= len
            const ny = gy / len
            gz /= len
            // Normal girada
            const nxr = side > 0 ? gx * cos + gz * sin : -gx * cos - gz * sin
            const nzr = side > 0 ? -gx * sin + gz * cos : gx * sin - gz * cos
            // Sin descartar caras: el búfer de profundidad decide qué se ve (así no quedan huecos)
            const sx = X * cos + Z * sin + C
            const depth = -X * sin + Z * cos
            // Color: cromo + texto + borde
            const diff = Math.max(0, nxr * lx + ny * ly + nzr * lz)
            const hz = nzr + lz
            const spec = Math.pow(Math.max(0, (nxr * lx + ny * ly + nzr * lz) * 0.5 + 0.5 * hz / 1.7), 24)
            const rim = 1 - Math.abs(nzr)
            const m = smooth(0.05, 1, diff)
            const ti = side > 0 ? i : n - 1 - i
            const t = draw ? (tex[j * n + ti] / 255) * 0.92 : 0
            let r = b0[0] + (b1[0] - b0[0]) * (1 - m)
            let g = b0[1] + (b1[1] - b0[1]) * (1 - m)
            let b = b0[2] + (b1[2] - b0[2]) * (1 - m)
            r += (tc[0] - r) * t
            g += (tc[1] - g) * t
            b += (tc[2] - b) * t
            const lift = 0.95 + 0.8 * rim * rim
            const sp = spec * 0.85 + rim * rim * rim * 0.35
            r = Math.min(255, r * lift * (1 - sp) + rc[0] * sp)
            g = Math.min(255, g * lift * (1 - sp) + rc[1] * sp)
            b = Math.min(255, b * lift * (1 - sp) + rc[2] * sp)
            // Rellena desde la muestra anterior para que no queden huecos al girar
            const x1 = Math.round(sx)
            const lo = prevX < 0 ? x1 : Math.min(prevX, x1)
            const hi = prevX < 0 ? x1 : Math.max(prevX, x1)
            prevX = x1
            for (let x = Math.max(0, lo); x <= Math.min(n - 1, hi); x++) {
              if (depth <= this.zbuf[x]) continue
              this.zbuf[x] = depth
              const o = (sj * n + x) * 4
              px[o] = r
              px[o + 1] = g
              px[o + 2] = b
              px[o + 3] = 255
              const q = sj * n + x
              this.obj[q] = side * (k + 1)
              this.lit[q] = Math.min(1, m * 0.8 + sp * 0.9 + rim * 0.15)
            }
          }
        }
      }
    }
    if (draw) this.ctx.putImageData(this.img, 0, 0)
  }

  /**
   * Dibuja el objeto con letras en un canvas visible.
   * @param ctx canvas de destino (ya escalado a píxeles del dispositivo)
   * @param w ancho en px CSS (el alto es igual)
   * @param cell tamaño de letra en px CSS
   * @param fill cuánto texto ya se escribió (0 a 1)
   * @param palette sombra, luz y color de las palabras especiales
   * @param special palabras que van en su color (por ejemplo, un nombre)
   */
  paintAscii(
    ctx: CanvasRenderingContext2D,
    w: number,
    cell: number,
    angle: number,
    fill: number,
    inflate: number,
    palette: { dark: string; light: string; special: string; empty: string },
    special: string[] = [],
  ) {
    this.render(angle, 1, inflate, false)
    const n = this.n
    const cw = cell * 0.6
    const ch = cell * 1.08
    const cols = Math.floor(w / cw)
    const rows = Math.floor(w / ch)
    const scale = n / w
    // Renglones de texto en el espacio del objeto (una celda de pantalla = una letra)
    // De frente, cada celda de pantalla es exactamente una letra: el texto se lee entero
    const tc = cols
    const tr = rows
    const key = `${tc}x${tr}|${this.phrases.join('|')}`
    if (key !== this.layoutKey) {
      this.layoutKey = key
      this.layout = []
      this.marks = []
      const list = this.phrases
      for (let r = 0; r < tr; r++) {
        let line = ''
        let p = (r * 3) % list.length
        while (line.length < tc) {
          line += list[p % list.length] + ' · '
          p++
        }
        line = line.slice(0, tc)
        this.layout.push(line)
        // Dónde caen las palabras especiales en este renglón
        const mark = new Uint8Array(tc)
        for (const word of special) {
          let at = line.indexOf(word)
          while (at >= 0) {
            mark.fill(1, at, at + word.length)
            at = line.indexOf(word, at + 1)
          }
        }
        this.marks.push(mark)
      }
    }
    const total = tc * tr
    const shown = Math.floor(total * fill)
    ctx.clearRect(0, 0, w, w)
    ctx.font = `700 ${cell}px "Space Mono", ui-monospace, monospace`
    ctx.textBaseline = 'middle'
    const levels = [palette.dark, palette.light]
    for (let r = 0; r < rows; r++) {
      const py = Math.min(n - 1, Math.floor((r + 0.5) * ch * scale))
      let run = ''
      let runStyle = ''
      let runX = 0
      const flush = () => {
        if (run.trim()) {
          ctx.fillStyle = runStyle
          ctx.fillText(run, runX, (r + 0.5) * ch)
        }
        run = ''
      }
      for (let c = 0; c < cols; c++) {
        const px = Math.min(n - 1, Math.floor((c + 0.5) * cw * scale))
        const q = py * n + px
        const o = this.obj[q]
        let chr = ' '
        let style = runStyle
        if (o) {
          const k = Math.abs(o) - 1
          const oi = k % n
          const oj = (k / n) | 0
          // Letra del renglón que cae en ese punto; el reverso se lee al derecho
          const trow = Math.min(tr - 1, Math.floor((oj / n) * tr))
          let tcol = Math.min(tc - 1, Math.floor((oi / n) * tc))
          if (o < 0) tcol = tc - 1 - tcol
          const idx = trow * tc + tcol
          if (idx < shown) {
            chr = this.layout[trow][tcol]
            if (chr === ' ') chr = '·'
            style = this.marks[trow][tcol] ? palette.special : levels[this.lit[q] > 0.55 ? 1 : 0]
          } else {
            chr = '.'
            style = palette.empty
          }
        }
        if (chr === ' ') {
          if (run) run += ' '
          continue
        }
        if (style !== runStyle || !run) {
          flush()
          runStyle = style
          runX = c * cw
        }
        run += chr
      }
      flush()
    }
  }

  private layoutKey = ''
  private layout: string[] = []
  private marks: Uint8Array[] = []
}
