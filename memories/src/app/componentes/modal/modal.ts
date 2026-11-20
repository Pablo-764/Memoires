import { Component, DestroyRef, ElementRef, afterNextRender, inject, input, output, signal, viewChild } from '@angular/core'
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
  // Arrastre del asa (solo hacia abajo); pasado el umbral, la hoja se cierra
  protected readonly drag = signal(0)
  private startY: number | null = null

  protected grab(e: PointerEvent) {
    this.startY = e.clientY
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  protected move(e: PointerEvent) {
    if (this.startY === null) return
    this.drag.set(Math.max(0, e.clientY - this.startY))
  }

  protected release() {
    if (this.startY === null) return
    this.startY = null
    if (this.drag() > 110) this.closed.emit()
    else this.drag.set(0)
  }

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
