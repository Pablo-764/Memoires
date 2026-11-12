import { DestroyRef, Directive, ElementRef, afterNextRender, inject } from '@angular/core'

// Distancia (px) a la que una letra empieza a reaccionar al cursor
const RADIUS = 170

interface Glyph {
  el: HTMLElement
  // Centro de la letra relativo al elemento, medido al montar y al cambiar el tamaño
  x: number
  y: number
  k: number
}

/**
 * Títulos que reaccionan al cursor: cada letra se levanta, crece y se separa en dos tintas
 * según qué tan cerca pasa el puntero. Las letras se envuelven una sola vez al montar;
 * se mueve todo con transform y solo mientras el cursor está cerca.
 */
@Directive({ selector: '[appPressure]' })
export class Pressure {
  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
    const destroyRef = inject(DestroyRef)

    afterNextRender(() => {
      const fine = matchMedia('(hover: hover) and (pointer: fine)')
      const still = matchMedia('(prefers-reduced-motion: reduce)')
      if (!fine.matches || still.matches) return

      if (!host.hasAttribute('aria-label')) host.setAttribute('aria-label', host.textContent?.replace(/\s+/g, ' ').trim() ?? '')
      const glyphs: Glyph[] = []
      split(host, glyphs)
      host.classList.add('pr-on')

      const measure = () => {
        const r = host.getBoundingClientRect()
        for (const g of glyphs) {
          const b = g.el.getBoundingClientRect()
          g.x = b.left - r.left + b.width / 2
          g.y = b.top - r.top + b.height / 2
        }
      }
      measure()

      const pointer = { x: -9999, y: -9999 }
      let frame = 0
      const paint = () => {
        frame = 0
        const r = host.getBoundingClientRect()
        let moving = false
        for (const g of glyphs) {
          const d = Math.hypot(pointer.x - (r.left + g.x), pointer.y - (r.top + g.y))
          const target = Math.max(0, 1 - d / RADIUS) ** 2
          g.k += (target - g.k) * 0.2
          if (Math.abs(target - g.k) > 0.002) moving = true
          const k = g.k < 0.003 ? 0 : g.k
          const side = Math.sign(pointer.x - (r.left + g.x)) || 1
          g.el.style.transform = k ? `translateY(${(-k * 0.16).toFixed(3)}em) scale(${(1 + k * 0.22).toFixed(3)}) rotate(${(-side * k * 7).toFixed(2)}deg)` : ''
          g.el.style.textShadow = k
            ? `${(k * 0.05).toFixed(3)}em 0 0 color-mix(in oklab, var(--color-romance) 70%, transparent), ${(-k * 0.05).toFixed(3)}em 0 0 color-mix(in oklab, var(--color-plan) 70%, transparent)`
            : ''
        }
        if (moving) frame = requestAnimationFrame(paint)
      }
      const onMove = (e: PointerEvent) => {
        pointer.x = e.clientX
        pointer.y = e.clientY
        if (!frame) frame = requestAnimationFrame(paint)
      }

      const io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) addEventListener('pointermove', onMove, { passive: true })
        else removeEventListener('pointermove', onMove)
      })
      io.observe(host)
      const ro = new ResizeObserver(measure)
      ro.observe(host)

      destroyRef.onDestroy(() => {
        cancelAnimationFrame(frame)
        io.disconnect()
        ro.disconnect()
        removeEventListener('pointermove', onMove)
      })
    })
  }
}

// Envuelve cada letra en su propio elemento, agrupadas por palabra para que no se corten al saltar de línea
function split(node: Node, out: Glyph[]) {
  for (const child of Array.from(node.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent ?? ''
      if (!text.trim()) continue
      const frag = document.createDocumentFragment()
      for (const part of text.split(/(\s+)/)) {
        if (!part) continue
        if (/^\s+$/.test(part)) {
          frag.append(document.createTextNode(' '))
          continue
        }
        const word = document.createElement('span')
        word.className = 'pr-word'
        word.setAttribute('aria-hidden', 'true')
        for (const ch of part) {
          const el = document.createElement('span')
          el.className = 'pr-ch'
          el.textContent = ch
          word.append(el)
          out.push({ el, x: 0, y: 0, k: 0 })
        }
        frag.append(word)
      }
      child.replaceWith(frag)
    } else if (child.nodeType === Node.ELEMENT_NODE && !(child as Element).matches('app-icon, svg, img')) {
      split(child, out)
    }
  }
}
