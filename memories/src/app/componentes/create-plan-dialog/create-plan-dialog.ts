import { Component, inject, output, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { AppStore } from '../../servicios/app-store'
import { Celebrate } from '../../servicios/celebrate'
import { type Plan } from '../../datos/mock'
import { type Intent } from '../../modelos/intents'
import { AUDIENCES, AUDIENCE_ORDER, PLAN_SIZES, SIZE_ORDER, type PlanAudience, type PlanSize } from '../../modelos/plan-formats'
import { Modal } from '../modal/modal'

@Component({
  selector: 'app-create-plan-dialog',
  imports: [FormsModule, Modal],
  styleUrl: './create-plan-dialog.css',
  templateUrl: './create-plan-dialog.html',
})
export class CreatePlanDialog {
  readonly closed = output<void>()

  private readonly store = inject(AppStore)
  private readonly celebrate = inject(Celebrate)
  protected readonly title = signal('')
  protected readonly description = signal('')
  protected readonly place = signal('')
  protected readonly when = signal('')
  protected readonly info = PLAN_SIZES
  protected readonly sizes = SIZE_ORDER
  protected readonly audienceInfo = AUDIENCES
  protected readonly audiences = AUDIENCE_ORDER
  protected readonly size = signal<PlanSize>('small')
  protected readonly audience = signal<PlanAudience>('any')
  protected readonly capacity = signal(PLAN_SIZES.small.preset)
  protected readonly intent = signal<Intent>('plan')
  protected readonly error = signal('')

  protected dotsFor(k: PlanSize) {
    return Array.from({ length: PLAN_SIZES[k].dots })
  }

  protected chooseSize(k: PlanSize) {
    this.size.set(k)
    this.capacity.set(PLAN_SIZES[k].preset)
  }

  protected submit() {
    if (!this.title().trim() || !this.place().trim() || !this.when().trim()) {
      this.error.set('Completa el título, el lugar y la fecha.')
      return
    }
    this.store.createPlan({
      title: this.title().trim(),
      description: this.description(),
      place: this.place(),
      when: this.when(),
      capacity: Number(this.capacity()),
      audience: this.audience(),
      intent: this.intent(),
    })
    this.store.toast('Plan publicado', 'ok')
    this.celebrate.play(this.intent())
    this.closed.emit()
  }
}
