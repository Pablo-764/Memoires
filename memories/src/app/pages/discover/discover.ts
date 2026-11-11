import { Component, DestroyRef, ElementRef, computed, effect, inject, signal, viewChild, viewChildren } from '@angular/core'
import { Router, RouterLink } from '@angular/router'
import { AppStore } from '../../servicios/app-store'
import { Celebrate } from '../../servicios/celebrate'
import { PEOPLE } from '../../datos/mock'
import { INTENTS, INTENT_ICON, INTENT_SHAPE, type Intent } from '../../modelos/intents'
import { EMPTY_PREFS, GENDERS, GENDER_ORDER, PLAN_PEOPLE, PLAN_PEOPLE_ORDER, PLAN_SIZES, SIZE_ORDER, usesGender, usesGroups, type Gender, type IntentPrefs, type PlanSize } from '../../modelos/plan-formats'
import { rankSuggestions, type Suggestion } from '../../utilidades/matching'
import { TIERS } from '../../modelos/plans'
import { ChoiceChip } from '../../componentes/choice-chip/choice-chip'
import { Icon } from '../../componentes/icon/icon'
import { Modal } from '../../componentes/modal/modal'
import { PillGroup } from '../../directivas/pill-group'
import { SwipeCard } from '../../componentes/swipe-card/swipe-card'
import { FiltersPanel } from '../../componentes/filters-panel/filters-panel'

@Component({
  selector: 'app-discover',
  imports: [RouterLink, ChoiceChip, Modal, Icon, PillGroup, SwipeCard, FiltersPanel],
  styleUrl: './discover.css',
  templateUrl: './discover.html',
})
export class Discover {
  protected readonly store = inject(AppStore)
  protected readonly router = inject(Router)
  private readonly celebrate = inject(Celebrate)

  protected readonly intents = INTENTS
  protected readonly icons = INTENT_ICON
  protected readonly shapes = INTENT_SHAPE
  protected readonly sizeOrder = SIZE_ORDER
  protected readonly sizeInfo = PLAN_SIZES
  protected readonly peopleOrder = PLAN_PEOPLE_ORDER
  protected readonly peopleInfo = PLAN_PEOPLE
  protected readonly genderOrder = GENDER_ORDER
  protected readonly genderInfo = GENDERS
  protected readonly groups = usesGroups
  protected readonly gendered = usesGender
  protected readonly selected = computed(() => {
    const i = this.store.filters().intent
    return i !== 'any' && this.store.me().intents.includes(i) ? i : null
  })
  protected readonly prefs = computed(() => {
    const i = this.selected()
    return (i && this.store.me().intentPrefs[i]) || EMPTY_PREFS
  })
  protected readonly filtersOpen = signal(false)
  protected readonly limitOpen = signal(false)

  private readonly cards = viewChildren(SwipeCard)
  private readonly likeBtn = viewChild<ElementRef<HTMLElement>>('likeBtn')
  private readonly passBtn = viewChild<ElementRef<HTMLElement>>('passBtn')

  protected readonly suggestions = computed(() => {
    const excluded = new Set([...Object.keys(this.store.decisions()), ...this.store.blocked(), ...this.store.suspended(), ...this.store.connections()])
    return rankSuggestions(this.store.me(), PEOPLE, excluded, this.store.filters())
  })
  protected readonly deck = computed(() => this.suggestions().slice(0, 3))
  protected readonly current = computed(() => this.suggestions()[0])
  protected readonly limits = computed(() => TIERS[this.store.tier()])
  protected readonly ambient = computed(() => {
    const person = this.current()?.person
    return person ? `color-mix(in oklab, hsl(${person.hue} 62% 58%) 20%, var(--color-mist))` : 'var(--color-mist)'
  })
  protected readonly activeFilters = computed(() => {
    const f = this.store.filters()
    return [f.ageMin !== 18 || f.ageMax !== 60, f.minShared > 0, f.availability !== 'any', f.language !== 'any', f.verifiedOnly].filter(Boolean).length
  })

  constructor() {
    effect(() => this.store.ambient.set(this.ambient()))
    // Si la intención elegida ya no está en el perfil, se vuelve a mostrar todo
    effect(() => {
      const i = this.store.filters().intent
      if (i !== 'any' && !this.store.me().intents.includes(i)) this.store.setFilters({ intent: 'any' })
    })
    inject(DestroyRef).onDestroy(() => this.store.ambient.set(null))
  }

  protected intentFor(s: Suggestion | undefined): Intent {
    if (!s) return this.store.preferredIntent()
    const preferred = this.store.preferredIntent()
    return s.sharedIntents.includes(preferred) ? preferred : s.sharedIntents[0]
  }

  protected readonly canLike = () => this.store.matchesUsed() < this.limits().weeklyMatches

  protected readonly onDecide = (id: string, d: 'like' | 'pass') => {
    const s = this.suggestions().find((x) => x.person.id === id)
    const r = this.store.decide(id, d)
    if (r === 'limit') {
      this.limitOpen.set(true)
      return false
    }
    if (r === 'liked') this.store.toast('Le avisaremos si también le interesa conocerte')
    if (r === 'match') this.celebrate.play(this.intentFor(s), { giant: true }).then(() => this.store.announceMatch(id))
    return true
  }

  protected patchPrefs(change: Partial<IntentPrefs>) {
    const i = this.selected()
    if (!i) return
    const me = this.store.me()
    this.store.updateProfile({ intentPrefs: { ...me.intentPrefs, [i]: { ...this.prefs(), ...change } } })
  }

  protected toggleSize(k: PlanSize) {
    const l = this.prefs().sizes
    this.patchPrefs({ sizes: l.includes(k) ? l.filter((x) => x !== k) : [...l, k] })
  }

  protected toggleGender(g: Gender) {
    const l = this.prefs().genders
    this.patchPrefs({ genders: l.includes(g) ? l.filter((x) => x !== g) : [...l, g] })
  }

  protected act(d: 'like' | 'pass') {
    this.cards()[0]?.fling(d)
  }

  protected onLaunch(d: 'like' | 'pass') {
    if (d === 'like') this.celebrate.play(this.intentFor(this.current()), { at: this.likeBtn()?.nativeElement })
    else this.celebrate.play('pass', { at: this.passBtn()?.nativeElement })
  }

  protected onPull(x: number) {
    const pull = Math.min(1, Math.abs(x) / 140)
    const like = this.likeBtn()?.nativeElement
    const pass = this.passBtn()?.nativeElement
    if (like) like.style.transform = x > 0 ? `scale(${1 + pull * 0.1})` : ''
    if (pass) pass.style.transform = x < 0 ? `scale(${1 + pull * 0.14})` : ''
  }

  protected goToSubscription() {
    this.limitOpen.set(false)
    this.router.navigateByUrl('/app/suscripcion')
  }
}
