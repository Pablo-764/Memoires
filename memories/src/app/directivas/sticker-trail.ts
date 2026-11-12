import { DestroyRef, Directive, ElementRef, afterNextRender, inject } from '@angular/core'

const PHOTOS = ['fotos/cafe.webp', 'fotos/correr.webp', 'fotos/juegos.webp', 'fotos/concierto.webp', 'fotos/biblioteca.webp']
const NOTES = ['¿café?', 'el domingo', 'concierto!', 'otra partida', 'nos vemos', 'mi plan', 'qué buena tarde', 'repetimos?', 'amigos nuevos', 'a correr']
// Distancia que hay que recorrer con el cursor para soltar otra foto
const STEP = 110
const MAX = 7

/**
 * Rastro de polaroids: al mover el cursor sobre el elemento van quedando fotos con nota a
 * mano que caen girando y se desvanecen. Solo con mouse y sin "reducir movimiento".
 * Las fotos se animan con la Web Animations API (transform y opacity).
 */
@Directive({ selector: '[appStickerTrail]', host: { class: 'relative isolate' } })
export class StickerTrail {
  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
    const destroyRef = inject(DestroyRef)

    afterNextRender(() => {
      const fine = matchMedia('(hover: hover) and (pointer: fine)')
      const still = matchMedia('(prefers-reduced-motion: reduce)')
      if (!fine.matches || still.matches) return

      const layer = document.createElement('div')
      layer.className = 'trail-layer'
      layer.setAttribute('aria-hidden', 'true')
      host.prepend(layer)

      let last: { x: number; y: number } | null = null
      let n = 0
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return
        const t = e.target as Element
        // No tapar lo que la persona está por usar
        if (t.closest('a, button, input, label, [role="radio"], .no-trail')) {
          last = null
          return
        }
        const r = host.getBoundingClientRect()
        const x = e.clientX - r.left
        const y = e.clientY - r.top
        if (last && Math.hypot(x - last.x, y - last.y) < STEP) return
        last = { x, y }
        drop(x, y)
      }

      const drop = (x: number, y: number) => {
        n++
        const card = document.createElement('figure')
        card.className = 'trail-card'
        const img = document.createElement('img')
        img.src = PHOTOS[n % PHOTOS.length]
        img.alt = ''
        img.decoding = 'async'
        const note = document.createElement('figcaption')
        note.textContent = NOTES[n % NOTES.length]
        card.append(img, note)
        card.style.left = `${x}px`
        card.style.top = `${y}px`
        layer.append(card)
        while (layer.children.length > MAX) layer.firstElementChild?.remove()

        const spin = (n % 2 ? 1 : -1) * (6 + ((n * 37) % 12))
        const fall = 60 + ((n * 53) % 50)
        card
          .animate(
            [
              { transform: `translate(-50%, -50%) scale(0.4) rotate(${spin * 2}deg)`, opacity: 0 },
              { transform: `translate(-50%, -50%) scale(1.04) rotate(${spin}deg)`, opacity: 1, offset: 0.18 },
              { transform: `translate(-50%, -50%) scale(1) rotate(${spin}deg)`, opacity: 1, offset: 0.55 },
              { transform: `translate(-50%, calc(-50% + ${fall}px)) scale(0.9) rotate(${spin * 1.8}deg)`, opacity: 0 },
            ],
            { duration: 1700, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'forwards' },
          )
          .finished.then(() => card.remove())
          .catch(() => card.remove())
      }

      host.addEventListener('pointermove', onMove, { passive: true })
      host.addEventListener('pointerleave', () => (last = null))
      destroyRef.onDestroy(() => {
        host.removeEventListener('pointermove', onMove)
        layer.remove()
      })
    })
  }
}
