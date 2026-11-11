import { Component, DestroyRef, ElementRef, afterNextRender, inject, input, output, viewChild } from '@angular/core'
import { Icon } from '../icon/icon'

// Se monta solo mientras está abierto: quien lo usa lo envuelve en un @if
@Component({
  selector: 'app-modal',
  imports: [Icon],
  styleUrl: './modal.css',
  templateUrl: './modal.html',
})
export class Modal {
  readonly title = input.required<string>()
  readonly wide = input(false)
  readonly closed = output<void>()

  private readonly panel = viewChild.required<ElementRef<HTMLElement>>('panel')

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
    const prev = document.activeElement as HTMLElement | null
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') this.closed.emit()
    }

    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'

    afterNextRender(() => {
      this.panel().nativeElement.querySelector<HTMLElement>('input, textarea, select, button:not([data-close])')?.focus()
    })

    inject(DestroyRef).onDestroy(() => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      prev?.focus()
      // Una copia inerte hace la salida, sin importar qué cerró el diálogo
      const ghost = host.firstElementChild?.cloneNode(true) as HTMLElement | undefined
      if (!ghost) return
      ghost.classList.add('modal-leaving')
      ghost.inert = true
      document.body.append(ghost)
      window.setTimeout(() => ghost.remove(), 260)
    })
  }
}
