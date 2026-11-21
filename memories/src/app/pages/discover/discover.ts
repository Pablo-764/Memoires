import { VerifySheet } from '../../componentes/verify-sheet/verify-sheet'
import { Component, DestroyRef, computed, effect, inject, signal, viewChildren } from '@angular/core'
import { Router, RouterLink } from '@angular/router'
import { AppStore } from '../../servicios/app-store'
import { Celebrate } from '../../servicios/celebrate'
import { Mando } from '../../servicios/mando'
import { PEOPLE } from '../../datos/mock'
import { INTENTS, INTENT_ICON, type Intent } from '../../modelos/intents'
import { EMPTY_PREFS, GENDERS, GENDER_ORDER, PLAN_PEOPLE, PLAN_PEOPLE_ORDER, PLAN_SIZES, SIZE_ORDER, usesGender, usesGroups, type Gender, type IntentPrefs, type PlanSize } from '../../modelos/plan-formats'
import { rankSuggestions, type Suggestion } from '../../utilidades/matching'
import { TIERS } from '../../modelos/plans'
import { ChoiceChip } from '../../componentes/choice-chip/choice-chip'
import { Icon } from '../../componentes/icon/icon'
import { Modal } from '../../componentes/modal/modal'
import { SwipeCard } from '../../componentes/swipe-card/swipe-card'
import { FiltersPanel } from '../../componentes/filters-panel/filters-panel'
import { AffinityMap, type Leaving } from '../../componentes/affinity-map/affinity-map'
import { Avatar } from '../../componentes/avatar/avatar'
import { Seal } from '../../componentes/seal/seal'
import { IntentBadge } from '../../componentes/intent-badge/intent-badge'
import { ReportDialog } from '../../componentes/report-dialog/report-dialog'
import { BlockDialog } from '../../componentes/block-dialog/block-dialog'

const MODE_KEY = 'memoires-descubre-modo'
function readMode(): 'mapa' | 'mazo' {
  try {
    return localStorage.getItem(MODE_KEY) === 'mazo' ? 'mazo' : 'mapa'
  } catch {
    return 'mapa'
  }
}

@Component({
  selector: 'app-discover',
  imports: [AffinityMap, Avatar, Seal, IntentBadge, ReportDialog, BlockDialog, RouterLink, ChoiceChip, Modal, Icon, SwipeCard, FiltersPanel, VerifySheet],
  styleUrl: './discover.css',
  templateUrl: './discover.html',
  host: { '(document:keydown)': 'onKey($event)' },
})
export class Discover {
  protected readonly store = inject(AppStore)
  protected readonly router = inject(Router)
  private readonly celebrate = inject(Celebrate)
  private readonly mando = inject(Mando)

  protected readonly intents = INTENTS
  protected readonly icons = INTENT_ICON
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
  protected readonly verifyOpen = signal(false)
  protected readonly reportOpen = signal(false)
  protected readonly blockOpen = signal(false)

  private readonly cards = viewChildren(SwipeCard)

  protected readonly suggestions = computed(() => {
    const excluded = new Set([...Object.keys(this.store.decisions()), ...this.store.blocked(), ...this.store.suspended(), ...this.store.connections()])
    return rankSuggestions(this.store.me(), PEOPLE, excluded, this.store.filters())
  })
  // La persona elegida en el mapa; si no hay, la de más afinidad
  protected readonly focusId = signal<string | null>(null)
  protected readonly current = computed(() => this.suggestions().find((s) => s.person.id === this.focusId()) ?? this.suggestions()[0])
  protected readonly deck = computed(() => {
    const c = this.current()
    return c ? [c, ...this.suggestions().filter((s) => s !== c)].slice(0, 3) : []
  })
  protected readonly limits = computed(() => TIERS[this.store.tier()])
  protected readonly leaving = signal<Leaving | null>(null)
  protected readonly mode = signal<'mapa' | 'mazo'>(readMode())
  protected readonly intentOf = (s: Suggestion) => this.intentFor(s)
  protected readonly intentLabel = (i: Intent) => INTENTS[i].label.toLowerCase()

  protected readonly planText = computed(() => {
    const s = this.current()
    if (!s) return ''
    const sizes = (s.person.groupSizes ?? []).map((k) => PLAN_SIZES[k].label.toLowerCase())
    return [sizes.length ? sizes.join(' o ') : null, s.person.availability.toLowerCase()].filter(Boolean).join(', ')
  })
  protected readonly activeFilters = computed(() => {
    const f = this.store.filters()
    return [f.ageMin !== 18 || f.ageMax !== 60, f.minShared > 0, f.availability !== 'any', f.language !== 'any', f.verifiedOnly].filter(Boolean).length
  })

  constructor() {
    effect(() => {
      const c = this.current()
      this.store.backdropTone.set(this.store.filters().intent !== 'any' ? (this.store.filters().intent as Intent) : c ? this.intentFor(c) : null)
    })
    effect(() => {
      const i = this.store.filters().intent
      if (i !== 'any' && !this.store.me().intents.includes(i)) this.store.setFilters({ intent: 'any' })
    })
    // En celular, el botón central del dock dice "Me interesa" a la persona elegida
    // Sin verificación no se conecta: el botón central lleva a verificarse
    effect((onCleanup) => {
      const label = this.store.verified() ? 'Me interesa' : 'Verifícate'
      onCleanup(this.mando.declarar({ label, run: () => this.decide('like') }))
    })
    inject(DestroyRef).onDestroy(() => this.store.backdropTone.set(null))
  }

  protected setMode(m: 'mapa' | 'mazo') {
    this.mode.set(m)
    try {
      localStorage.setItem(MODE_KEY, m)
    } catch {
      /* sin almacenamiento: dura esta visita */
    }
  }

  protected intentFor(s: Suggestion | undefined): Intent {
    if (!s) return this.store.preferredIntent()
    const preferred = this.store.preferredIntent()
    return s.sharedIntents.includes(preferred) ? preferred : s.sharedIntents[0]
  }

  protected readonly canLike = () => this.store.likesLeft() > 0

  protected readonly onDecide = (id: string, d: 'like' | 'pass') => {
    const s = this.suggestions().find((x) => x.person.id === id)
    const r = this.store.decide(id, d)
    if (r === 'limit') {
      this.limitOpen.set(true)
      return false
    }
    if (r === 'unverified') {
      this.verifyOpen.set(true)
      return false
    }
    if (r === 'liked') this.store.toast('Le avisaremos si también le interesa conocerte')
    if (r === 'match') this.celebrate.play(this.intentFor(s), { giant: true }).then(() => this.store.announceMatch(id))
    this.focusId.set(null)
    return true
  }

  /**
   * Gesto del mapa: "Me interesa" anuda el hilo y el nodo queda orbitando cerca;
   * "Ahora no" lo aleja y se desvanece. En el mazo, la tarjeta sale volando.
   */
  protected decide(d: 'like' | 'pass') {
    const c = this.current()
    if (!c || this.leaving()) return
    if (this.mode() === 'mazo') return void this.cards()[0]?.fling(d)
    if (d === 'like' && !this.store.verified()) return void this.verifyOpen.set(true)
    if (d === 'like' && !this.canLike()) return void this.limitOpen.set(true)
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    this.leaving.set({ id: c.person.id, kind: d })
    setTimeout(
      () => {
        this.leaving.set(null)
        this.onDecide(c.person.id, d)
      },
      reduce ? 0 : 620,
    )
  }

  protected onKey(e: KeyboardEvent) {
    const t = e.target as HTMLElement
    if (t?.closest('input, textarea, select, [contenteditable], [role="dialog"]')) return
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      this.decide('like')
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      this.decide('pass')
    }
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

  protected onLaunch(d: 'like' | 'pass') {
    if (d === 'like') this.celebrate.play(this.intentFor(this.current()))
  }

  protected goToSubscription() {
    this.limitOpen.set(false)
    this.router.navigateByUrl('/app/suscripcion')
  }
}
