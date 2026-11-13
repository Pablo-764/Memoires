/**
 * Mancha de tinta del cambio de tema (dis-021).
 *
 * - Siluetas con borde fibroso, generadas una sola vez por sesión en un canvas (768 px)
 *   y usadas como imagen (blob:). Escalar un mapa de bits es barato; aplicar un filtro
 *   en la máscara se recalcularía en cada cuadro.
 * - Cada silueta va girada a un ángulo al azar; tras usarla se vuelve a generar con otro
 *   ángulo en un momento libre, y nunca se repite la del cambio anterior.
 * - Los cuadros clave se calculan aquí: la mancha principal y las gotas tienen tiempos y
 *   curvas distintos, y el anillo de la orilla mojada sigue al borde.
 */

const SIZE = 768
// Radio mínimo del cuerpo de la mancha (fracción de media caja): sirve para calcular cuánto crecer
export const INK_MIN_RADIUS = 0.4
// Radio medio del cuerpo (fracción de media caja), para el grosor del anillo
const INK_MEAN_RADIUS = 0.5

type Pool = { url: string; rot: number }[]
let pool: Pool = []
let preparing: Promise<void> | null = null
let last = -1

const rng = (seed: number) => () => {
  seed |= 0
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

/** Dibuja una silueta de tinta con borde fibroso y la devuelve como blob: URL. */
async function makeMask(shape: number, rot: number): Promise<string> {
  const canvas = typeof OffscreenCanvas !== 'undefined' ? new OffscreenCanvas(SIZE, SIZE) : Object.assign(document.createElement('canvas'), { width: SIZE, height: SIZE })
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  const rand = rng(1009 * (shape + 1) + Math.floor(rot * 1000))
  const C = SIZE / 2
  // Salpicadura abstracta: un cuerpo con lóbulos, brazos largos que se adelgazan y
  // terminan en una gota, y ruido fino en el contorno (las fibras del papel)
  const low = Array.from({ length: 4 }, (_, i) => ({ k: i + 2, a: 0.04 + rand() * 0.05, p: rand() * Math.PI * 2 }))
  const fine = Array.from({ length: 10 }, (_, i) => ({ k: 18 + i * 4, a: 0.003 + rand() * 0.004, p: rand() * Math.PI * 2 }))
  const arms = Array.from({ length: 5 + Math.floor(rand() * 4) }, () => ({
    at: rand() * Math.PI * 2,
    len: 0.14 + rand() * 0.3,
    width: 0.05 + rand() * 0.09,
  }))
  const angDist = (a: number, b: number) => Math.atan2(Math.sin(a - b), Math.cos(a - b))
  const radius = (t: number) => {
    let r = INK_MEAN_RADIUS
    for (const h of low) r += h.a * Math.cos(h.k * t + h.p)
    for (const arm of arms) {
      const d = angDist(t, arm.at) / arm.width
      r += arm.len * Math.exp(-d * d)
    }
    for (const h of fine) r += h.a * Math.cos(h.k * t + h.p)
    return Math.max(INK_MIN_RADIUS + 0.02, Math.min(0.94, r))
  }
  ctx.fillStyle = '#000'
  ctx.strokeStyle = '#000'
  // Borde suave: un leve desenfoque al rellenar
  ctx.filter = 'blur(1.2px)'
  ctx.beginPath()
  const N = 900
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * Math.PI * 2
    const r = radius(t) * C
    const x = C + r * Math.cos(t + rot)
    const y = C + r * Math.sin(t + rot)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.fill()
  ctx.filter = 'none'
  // Fibras: hilitos que salen del borde como tinta que se corre entre las fibras
  for (let i = 0; i < 1500; i++) {
    const t = rand() * Math.PI * 2
    const r = radius(t) * C - 1
    const len = 2 + rand() * rand() * 14
    const a = t + rot + (rand() - 0.5) * 1.1
    const x = C + r * Math.cos(t + rot)
    const y = C + r * Math.sin(t + rot)
    ctx.globalAlpha = 0.45 + rand() * 0.5
    ctx.lineWidth = 0.5 + rand() * 1.1
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len)
    ctx.stroke()
  }
  // Gota redonda en la punta de cada brazo y, a veces, una suelta un poco más allá
  for (const arm of arms) {
    const tip = Math.min(0.94, radius(arm.at)) * C
    const bulb = (0.025 + rand() * 0.035) * C
    const x = C + (tip - bulb * 0.4) * Math.cos(arm.at + rot)
    const y = C + (tip - bulb * 0.4) * Math.sin(arm.at + rot)
    ctx.globalAlpha = 1
    ctx.beginPath()
    ctx.arc(x, y, bulb, 0, Math.PI * 2)
    ctx.fill()
    if (rand() < 0.6 && tip / C < 0.86) {
      const far = tip + bulb * (2.2 + rand() * 2)
      ctx.beginPath()
      ctx.arc(C + far * Math.cos(arm.at + rot + (rand() - 0.5) * 0.1), C + far * Math.sin(arm.at + rot + (rand() - 0.5) * 0.1), bulb * (0.35 + rand() * 0.3), 0, Math.PI * 2)
      ctx.fill()
    }
  }
  // Salpicaduras finas pegadas a la orilla
  for (let i = 0; i < 60; i++) {
    const t = rand() * Math.PI * 2
    const r = (radius(t) + 0.01 + rand() * 0.04) * C
    ctx.globalAlpha = 0.6 + rand() * 0.4
    ctx.beginPath()
    ctx.arc(C + r * Math.cos(t + rot), C + r * Math.sin(t + rot), 0.8 + rand() * 2.2, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
  const blob = 'convertToBlob' in canvas ? await (canvas as OffscreenCanvas).convertToBlob({ type: 'image/png' }) : await new Promise<Blob>((ok) => (canvas as HTMLCanvasElement).toBlob((b) => ok(b!), 'image/png'))
  return URL.createObjectURL(blob)
}

/** Prepara las tres siluetas (una vez por sesión). Se llama al pasar por el botón de tema o al abrir Ajustes. */
export function prepareInk(): Promise<void> {
  if (!preparing) {
    preparing = Promise.all([0, 1, 2].map(async (shape) => {
      const rot = Math.random() * Math.PI * 2
      return { url: await makeMask(shape, rot), rot }
    })).then((p) => {
      pool = p
    }).catch(() => {
      preparing = null
    })
  }
  return preparing
}

export const inkReady = () => pool.length === 3

/** Elige una silueta distinta a la del cambio anterior; luego la regenera girada a otro ángulo. */
export function takeInk(): string | null {
  if (!inkReady()) return null
  let i = Math.floor(Math.random() * 3)
  if (i === last) i = (i + 1 + Math.floor(Math.random() * 2)) % 3
  last = i
  const used = pool[i]
  const refresh = () =>
    makeMask(i, Math.random() * Math.PI * 2).then((url) => {
      const old = pool[i]
      pool[i] = { url, rot: 0 }
      // La anterior se libera cuando ya terminó la transición
      setTimeout(() => URL.revokeObjectURL(old.url), 2000)
    }, () => undefined)
  const idle = (globalThis as { requestIdleCallback?: (cb: () => void) => void }).requestIdleCallback
  setTimeout(() => (idle ? idle(refresh) : refresh()), 900)
  return used.url
}

// ---------- Curvas ----------
/** cubic-bezier como función (método de Newton y bisección, como los navegadores). */
export function bezier(x1: number, y1: number, x2: number, y2: number) {
  const ax = 3 * x1 - 3 * x2 + 1
  const bx = 3 * x2 - 6 * x1
  const cx = 3 * x1
  const ay = 3 * y1 - 3 * y2 + 1
  const by = 3 * y2 - 6 * y1
  const cy = 3 * y1
  const sx = (t: number) => ((ax * t + bx) * t + cx) * t
  const sy = (t: number) => ((ay * t + by) * t + cy) * t
  const dx = (t: number) => (3 * ax * t + 2 * bx) * t + cx
  return (x: number) => {
    if (x <= 0) return 0
    if (x >= 1) return 1
    let t = x
    for (let i = 0; i < 6; i++) {
      const e = sx(t) - x
      const d = dx(t)
      if (Math.abs(e) < 1e-5 || Math.abs(d) < 1e-6) break
      t -= e / d
    }
    if (t < 0 || t > 1) {
      let lo = 0
      let hi = 1
      t = x
      for (let i = 0; i < 20; i++) {
        if (sx(t) < x) lo = t
        else hi = t
        t = (lo + hi) / 2
      }
    }
    return sy(t)
  }
}

const DROP = bezier(0.2, 0.9, 0.3, 1)

export interface InkPlan {
  duration: number
  // Lista de capas para mask-image (mancha + gotas)
  layers: string
  root: Keyframe[]
  ring: Keyframe[]
  ringLayers: string
}

/**
 * Cuadros clave de la mancha.
 * spread: se esparce (680 ms): gotas de 0 a 90 ms, la mancha nace a los 60 ms y se las traga.
 * retract: se retira hacia el botón (520 ms) y deja 2 o 3 gotas que se evaporan 120 ms después.
 */
// Avance de la mancha (0 a 1): sale rápido, se queda un momento a media pantalla para que se
// aprecie la forma, y luego termina de cubrir
const SHOW = bezier(0.2, 0.9, 0.35, 1)
const FINISH = bezier(0.55, 0, 0.75, 0.3)
function spreadCurve(u: number) {
  if (u < 0.32) return 0.4 * SHOW(u / 0.32)
  if (u < 0.7) return 0.4 + 0.1 * ((u - 0.32) / 0.38)
  return 0.5 + 0.5 * FINISH((u - 0.7) / 0.3)
}

export function planInk(url: string, x: number, y: number, w: number, h: number, spread: boolean): InkPlan {
  const R = Math.hypot(Math.max(x, w - x), Math.max(y, h - y))
  const end = (2 * R) / INK_MIN_RADIUS + 24
  const drops = Array.from({ length: spread ? 5 + Math.round(Math.random()) : 2 + Math.round(Math.random()) }, () => {
    const a = Math.random() * Math.PI * 2
    const d = (spread ? 36 : 50) + Math.random() * (spread ? 120 : 160)
    return { x: x + Math.cos(a) * d, y: y + Math.sin(a) * d, size: 10 + Math.random() * 26, start: Math.random() * 70 }
  })
  const dropImg = 'radial-gradient(closest-side, #000 72%, rgb(0 0 0 / 0.6) 86%, transparent 100%)'
  const layers = [`url("${url}")`, ...drops.map(() => dropImg)].join(', ')
  const ringLayers = `url("${url}"), url("${url}")`
  // Más lento que antes: la forma se alcanza a ver en ambos sentidos
  const main = spread ? 1500 : 1300
  const duration = spread ? 1580 : 1450
  const thick = 8
  const delta = thick / (INK_MEAN_RADIUS / 2)
  const root: Keyframe[] = []
  const ring: Keyframe[] = []
  const steps = 60
  for (let s = 0; s <= steps; s++) {
    const t = (s / steps) * duration
    let m: number
    if (spread) m = t < 80 ? 0 : end * spreadCurve(Math.min(1, (t - 80) / main))
    else m = t >= main ? 0 : end * spreadCurve(1 - t / main)
    const sizes = [m]
    const pos = [[x - m / 2, y - m / 2]]
    for (const d of drops) {
      let z: number
      if (spread) z = t < d.start ? 0 : d.size * DROP(Math.min(1, (t - d.start) / 90))
      else z = t <= main ? d.size : d.size * (1 - Math.min(1, (t - main) / 150))
      sizes.push(z)
      pos.push([d.x - z / 2, d.y - z / 2])
    }
    root.push({
      offset: s / steps,
      maskSize: sizes.map((z) => `${z.toFixed(1)}px ${z.toFixed(1)}px`).join(', '),
      maskPosition: pos.map(([px, py]) => `${px.toFixed(1)}px ${py.toFixed(1)}px`).join(', '),
    })
    const inner = Math.max(0, m - delta)
    const fade = spread ? (t < duration * 0.75 ? 1 : 1 - (t - duration * 0.75) / (duration * 0.25)) : t < main * 0.8 ? 1 : Math.max(0, 1 - (t - main * 0.8) / (main * 0.2))
    ring.push({
      offset: s / steps,
      opacity: m > 4 ? fade : 0,
      maskSize: `${m.toFixed(1)}px ${m.toFixed(1)}px, ${inner.toFixed(1)}px ${inner.toFixed(1)}px`,
      maskPosition: `${(x - m / 2).toFixed(1)}px ${(y - m / 2).toFixed(1)}px, ${(x - inner / 2).toFixed(1)}px ${(y - inner / 2).toFixed(1)}px`,
    })
  }
  return { duration, layers, root, ring, ringLayers }
}
