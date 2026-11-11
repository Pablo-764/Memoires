import { Component, inject, input, output } from '@angular/core'
import { AppStore } from '../../servicios/app-store'
import { Celebrate } from '../../servicios/celebrate'
import { Modal } from '../modal/modal'

@Component({
  selector: 'app-block-dialog',
  imports: [Modal],
  styleUrl: './block-dialog.css',
  templateUrl: './block-dialog.html',
})
export class BlockDialog {
  readonly personId = input.required<string>()
  readonly name = input.required<string>()
  readonly closed = output<void>()
  readonly done = output<void>()

  private readonly store = inject(AppStore)
  private readonly celebrate = inject(Celebrate)

  protected confirm() {
    this.store.block(this.personId())
    this.store.toast(`${this.name()} bloqueado`, 'ok')
    this.celebrate.play('block')
    this.closed.emit()
    this.done.emit()
  }
}
