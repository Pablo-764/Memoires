import { DestroyRef, Directive, ElementRef, afterNextRender, afterRenderEffect, inject, input } from '@angular/core'

// Desliza la píldora .group-pill debajo de la opción marcada y le pone el relleno
// de la intención de esa opción (data-tone).
@Directive({ selector: '[appPillGroup]', host: { class: 'pill-group' } })
export class PillGroup {
  readonly appPillGroup = input.required<unknown>()

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement

  constructor() {
    afterRenderEffect(() => {
      this.appPillGroup()
      this.place()
    })

    const destroyRef = inject(DestroyRef)
    afterNextRender(() => {
      const observer = new ResizeObserver(() => this.place())
      observer.observe(this.host)
      destroyRef.onDestroy(() => observer.disconnect())
      requestAnimationFrame(() => this.host.querySelector('.group-pill')?.classList.add('is-ready'))
    })
  }

  private place() {
    const pill = this.host.querySelector<HTMLElement>('.group-pill')
    const active = this.host.querySelector<HTMLElement>('[aria-pressed="true"], [aria-selected="true"], [aria-checked="true"], [aria-current="page"]')
    if (!pill) return
    pill.style.visibility = active ? '' : 'hidden'
    if (!active) return
    const { offsetLeft: x, offsetTop: y, offsetWidth: w, offsetHeight: h } = active
    const tone = active.dataset['tone']
    if (tone && tone !== 'accent') pill.dataset['tone'] = tone
    else delete pill.dataset['tone']
    pill.style.width = `${w}px`
    pill.style.height = `${h}px`
    pill.style.transform = `translate(${x}px, ${y}px)`
  }
}
