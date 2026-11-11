import { Component, inject, input, output, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { AppStore } from '../../servicios/app-store'
import { Celebrate } from '../../servicios/celebrate'
import { Modal } from '../modal/modal'

const REASONS = ['Perfil falso', 'Mensajes ofensivos o acoso', 'Contenido inapropiado', 'Spam o publicidad', 'Parece menor de edad', 'Otro motivo']

@Component({
  selector: 'app-report-dialog',
  imports: [FormsModule, Modal],
  styleUrl: './report-dialog.css',
  templateUrl: './report-dialog.html',
})
export class ReportDialog {
  readonly personId = input.required<string>()
  readonly name = input.required<string>()
  readonly closed = output<void>()
  readonly done = output<void>()

  private readonly store = inject(AppStore)
  private readonly celebrate = inject(Celebrate)
  protected readonly reasons = REASONS
  protected readonly reason = signal(REASONS[0])
  protected readonly detail = signal('')
  protected readonly alsoBlock = signal(true)

  protected submit() {
    this.store.report(this.personId(), this.reason(), this.detail().trim())
    if (this.alsoBlock()) this.store.block(this.personId())
    this.store.toast(this.alsoBlock() ? `Reporte enviado y ${this.name()} bloqueado` : 'Reporte enviado', 'ok')
    this.celebrate.play('report')
    this.closed.emit()
    this.done.emit()
  }
}
