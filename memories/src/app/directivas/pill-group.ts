import { DestroyRef, Directive, ElementRef, afterNextRender, afterRenderEffect, inject, input } from '@angular/core'

// Segunda tinta de cada color: se imprime desfasada detrás de la figura
const ECHO: Record<string, string> = { accent: 'romance', friend: 'romance', plan: 'hobby', hobby: 'plan', romance: 'friend' }

// Mueve la figura .group-pill (y su eco, si existe) debajo de la opción marcada
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
      requestAnimationFrame(() => this.host.querySelectorAll('.group-pill, .group-echo').forEach((el) => el.classList.add('is-ready')))
    })
  }

  private place() {
    const pill = this.host.querySelector<HTMLElement>('.group-pill')
    const echo = this.host.querySelector<HTMLElement>('.group-echo')
    const active = this.host.querySelector<HTMLElement>('[aria-pressed="true"], [aria-selected="true"]')
    if (!pill) return
    for (const el of [pill, echo]) if (el) el.style.opacity = active ? '' : '0'
    if (!active) return

    const shape = active.dataset['shape'] ?? 'pill'
    const tone = active.dataset['tone'] ?? 'accent'
    const { offsetLeft: x, offsetTop: y, offsetWidth: w, offsetHeight: h } = active

    pill.dataset['shape'] = shape
    pill.style.setProperty('--tone', `var(--color-${tone})`)
    pill.style.width = `${w}px`
    pill.style.height = `${h}px`
    pill.style.transform = `translate(${x}px, ${y}px)`

    if (echo) {
      echo.dataset['shape'] = shape
      echo.style.setProperty('--tone-2', `var(--color-${ECHO[tone] ?? 'romance'})`)
      echo.style.width = `${w}px`
      echo.style.height = `${h}px`
      echo.style.transform = `translate(${x + 5}px, ${y + 4}px)`
    }
  }
}
