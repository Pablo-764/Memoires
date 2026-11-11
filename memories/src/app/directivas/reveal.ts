import { DestroyRef, Directive, ElementRef, afterNextRender, inject } from '@angular/core'

// Revela el elemento al entrar en pantalla; sin JS o con movimiento reducido queda visible
@Directive({ selector: '[appReveal]' })
export class Reveal {
  constructor() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
    el.classList.add('reveal-armed')

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        el.classList.add('is-in')
        observer.disconnect()
        // Sin este ajuste el retardo escalonado también frenaría el hover
        window.setTimeout(() => el.style.setProperty('--i', '0'), 1400)
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    )

    afterNextRender(() => observer.observe(el))
    inject(DestroyRef).onDestroy(() => observer.disconnect())
  }
}
