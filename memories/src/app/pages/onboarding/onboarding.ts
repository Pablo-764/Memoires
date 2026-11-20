import { Component, DestroyRef, OnInit, computed, effect, inject, input, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { AppStore } from '../../servicios/app-store'
import { CITIES, INTENTS, INTENT_ORDER, type Intent } from '../../modelos/intents'
import { ChoiceChip } from '../../componentes/choice-chip/choice-chip'
import { Icon } from '../../componentes/icon/icon'
import { IntentBadge } from '../../componentes/intent-badge/intent-badge'
import { Logo } from '../../componentes/logo/logo'
import { IntentPrefsEditor } from '../../componentes/intent-prefs/intent-prefs'
import { InterestPicker } from '../../componentes/interest-picker/interest-picker'
import { EMPTY_PREFS, GENDERS, GENDER_ORDER, usesGender, usesGroups, type Gender, type IntentPrefs } from '../../modelos/plan-formats'
import { IntentConstellation } from '../../componentes/intent-constellation/intent-constellation'

@Component({
  selector: 'app-onboarding',
  imports: [IntentConstellation, FormsModule, ChoiceChip, Icon, IntentBadge, IntentPrefsEditor, InterestPicker, Logo],
  styleUrl: './onboarding.css',
  templateUrl: './onboarding.html',
})
export class Onboarding implements OnInit {
  /** Intención que llega desde la portada; se deja elegida si aún no hay ninguna. */
  readonly intencion = input<string>()

  ngOnInit() {
    const i = this.intencion() as Intent | undefined
    if (i && i in INTENTS && !this.intents().length) this.intents.set([i])
  }

  private readonly store = inject(AppStore)
  private readonly router = inject(Router)

  protected readonly me = this.store.me
  protected readonly catalog = INTENTS
  protected readonly order = INTENT_ORDER
  protected readonly genderOrder = GENDER_ORDER
  protected readonly genderInfo = GENDERS
  protected readonly cities = CITIES
  protected readonly steps = ['Intención', 'Intereses', 'Tu perfil']

  protected readonly step = signal(0)
  protected readonly direction = signal<'forward' | 'back'>('forward')
  protected readonly intents = signal<Intent[]>(this.me().intents)
  protected readonly interests = signal<string[]>(this.me().interests)
  protected readonly done = signal(false)
  protected readonly gender = signal<Gender | 'unsaid'>(this.me().gender)
  protected readonly prefs = signal<Partial<Record<Intent, IntentPrefs>>>(this.me().intentPrefs)
  protected readonly prefIntents = computed(() => this.intents().filter((i) => usesGroups(i) || usesGender(i)))
  protected readonly city = signal(this.me().city)
  protected readonly bio = signal(this.me().bio)

  constructor() {
    // La página toma la tinta de la última intención elegida
    effect(() => this.store.backdropTone.set(this.intents().at(-1) ?? null))
    inject(DestroyRef).onDestroy(() => this.store.backdropTone.set(null))
  }

  protected readonly canNext = computed(() => {
    const s = this.step()
    return s === 0 ? this.intents().length > 0 : s === 1 ? this.interests().length >= 3 : this.bio().trim().length >= 10
  })

  protected prefsOf(i: Intent) {
    return this.prefs()[i] ?? EMPTY_PREFS
  }

  protected setPrefs(i: Intent, value: IntentPrefs) {
    this.prefs.update((p) => ({ ...p, [i]: value }))
  }

  protected toggleIntent(v: Intent) {
    this.intents.update((l) => (l.includes(v) ? l.filter((x) => x !== v) : [...l, v]))
  }

  protected toggleInterest(v: string) {
    this.interests.update((l) => (l.includes(v) ? l.filter((x) => x !== v) : [...l, v]))
  }

  protected back() {
    this.direction.set('back')
    this.step.update((s) => s - 1)
  }

  protected next() {
    if (this.step() < 2) {
      this.direction.set('forward')
      this.step.update((s) => s + 1)
      return
    }
    this.store.completeOnboarding({ city: this.city(), bio: this.bio().trim(), intents: this.intents(), interests: this.interests(), gender: this.gender(), intentPrefs: this.prefs() })
    // Primer momento personal: tu estrella cubierta con tus intereses; luego, a Descubre
    this.done.set(true)
    window.setTimeout(() => this.router.navigateByUrl('/app/descubre'), matchMedia('(prefers-reduced-motion: reduce)').matches ? 1400 : 3400)
  }
}
