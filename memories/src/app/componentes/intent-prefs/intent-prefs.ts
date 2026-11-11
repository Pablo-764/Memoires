import { Component, computed, input, model } from '@angular/core'
import { INTENTS, type Intent } from '../../modelos/intents'
import { GENDERS, GENDER_ORDER, PLAN_PEOPLE, PLAN_PEOPLE_ORDER, PLAN_SIZES, SIZE_ORDER, usesGender, usesGroups, type Gender, type IntentPrefs as Prefs, type PlanSize } from '../../modelos/plan-formats'

@Component({
  selector: 'app-intent-prefs',
  styleUrl: './intent-prefs.css',
  templateUrl: './intent-prefs.html',
  host: { class: 'block swap-in' },
})
export class IntentPrefsEditor {
  readonly intent = input.required<Intent>()
  readonly value = model.required<Prefs>()

  protected readonly label = computed(() => INTENTS[this.intent()].label.toLowerCase())
  protected readonly groups = computed(() => usesGroups(this.intent()))
  protected readonly gender = computed(() => usesGender(this.intent()))
  protected readonly sizeOrder = SIZE_ORDER
  protected readonly sizeInfo = PLAN_SIZES
  protected readonly peopleOrder = PLAN_PEOPLE_ORDER
  protected readonly peopleInfo = PLAN_PEOPLE
  protected readonly genderOrder = GENDER_ORDER
  protected readonly genderInfo = GENDERS

  protected dots(k: PlanSize) {
    return Array.from({ length: PLAN_SIZES[k].dots })
  }

  protected toggleSize(k: PlanSize) {
    const l = this.value().sizes
    this.value.set({ ...this.value(), sizes: l.includes(k) ? l.filter((x) => x !== k) : [...l, k] })
  }

  protected toggleGender(g: Gender) {
    const l = this.value().genders
    this.value.set({ ...this.value(), genders: l.includes(g) ? l.filter((x) => x !== g) : [...l, g] })
  }
}
