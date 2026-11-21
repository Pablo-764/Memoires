import { NgTemplateOutlet } from '@angular/common'
import { VerifySheet } from '../../componentes/verify-sheet/verify-sheet'
import { ApplicationRef, Component, DestroyRef, computed, inject, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { AppStore } from '../../servicios/app-store'
import { Celebrate } from '../../servicios/celebrate'
import { runListTransition } from '../../utilidades/list-transition'
import { PAST_PLANS, personById, type Plan } from '../../datos/mock'
import { INTENTS, INTENT_ICON, INTENT_ORDER, type Intent } from '../../modelos/intents'
import { AUDIENCES, PLAN_SIZES, SIZE_ORDER, sizeOf, type PlanSize } from '../../modelos/plan-formats'
import { Avatar } from '../../componentes/avatar/avatar'
import { Icon } from '../../componentes/icon/icon'
import { IntentBadge } from '../../componentes/intent-badge/intent-badge'
import { PillGroup } from '../../directivas/pill-group'
import { CreatePlanDialog } from '../../componentes/create-plan-dialog/create-plan-dialog'

import { PlanMosaic, type MosaicItem } from '../../componentes/plan-mosaic/plan-mosaic'
import { ChoiceChip } from '../../componentes/choice-chip/choice-chip'
import { highlight, matches } from '../../utilidades/text-search'
import { zonaDe } from '../../modelos/zonas'
import { diaDe, minutosDe, proximosDias } from '../../utilidades/semana'
import { Mando } from '../../servicios/mando'

// Fotos para los planes que no traen la suya

@Component({
  selector: 'app-plans',
  imports: [NgTemplateOutlet, RouterLink, Avatar, ChoiceChip, Icon, IntentBadge, PillGroup, CreatePlanDialog, PlanMosaic, VerifySheet],
  styleUrl: './plans.css',
  templateUrl: './plans.html',
})
export class Plans {
  protected readonly store = inject(AppStore)
  protected readonly verifyOpen = signal(false)
  private readonly appRef = inject(ApplicationRef)
  private readonly celebrate = inject(Celebrate)
  protected readonly intents = INTENTS
  protected readonly filterOptions = INTENT_ORDER.filter((i) => i !== 'romance')
  protected readonly creating = signal(false)
  protected readonly filter = signal<Intent | 'all'>('all')
  protected readonly sizeFilter = signal<PlanSize | 'all'>('all')
  protected readonly icons = INTENT_ICON
  protected readonly sizes = SIZE_ORDER
  protected readonly sizeInfo = PLAN_SIZES
  protected readonly audienceInfo = AUDIENCES

  // Planes cumplidos: foto en tramado (o la nota a mano si no hay), fecha e iniciales de quienes fueron
  protected readonly album = computed<MosaicItem[]>(() =>
    PAST_PLANS.filter((p) => !p.people.some((id) => this.store.blocked().includes(id))).map((p) => ({
      id: p.id,
      photo: p.photo,
      note: p.title,
      tone: p.intent,
      date: `${p.date} ${p.time}`,
      people: p.people.map((id) => (id === 'me' ? 'TÚ' : (personById(id)?.name[0] ?? '?'))),
    })),
  )

  // Filtros encadenados: primero la zona y luego las colonias de esa zona
  protected readonly zone = signal<string>('all')
  protected readonly colonia = signal<string>('all')
  protected readonly zoneOf = (p: Plan) => zonaDe(p.place)
  protected readonly zones = computed(() => [...new Set(this.store.plans().map((p) => zonaDe(p.place).zona))].sort())
  protected readonly colonias = computed(() => [
    ...new Set(this.store.plans().map((p) => zonaDe(p.place)).filter((z) => z.zona === this.zone() && z.colonia).map((z) => z.colonia)),
  ])

  // Buscador con sugerencias: título, lugar, descripción o quién organiza
  protected readonly query = signal('')
  protected readonly focused = signal(false)
  protected readonly active = signal(-1)
  protected readonly parts = (text: string) => highlight(text, this.query())
  protected readonly suggestions = computed(() => {
    const q = this.query().trim()
    if (q.length < 2) return []
    return this.store
      .plans()
      .flatMap((plan) => {
        const hostName = plan.hostId === 'me' ? 'ti' : (personById(plan.hostId)?.name ?? '')
        const why = matches(plan.title, q)
          ? 'En el nombre del plan'
          : matches(plan.place, q)
            ? 'En el lugar: ' + plan.place
            : matches(hostName, q)
              ? 'Lo organiza ' + hostName
              : matches(plan.description, q)
                ? 'En la descripción'
                : null
        return why ? [{ plan, why }] : []
      })
      .slice(0, 6)
  })
  protected readonly suggestOpen = computed(() => this.focused() && this.suggestions().length > 0)

  // Franja de calendario: los próximos siete días con sus planes; elegir un día filtra la agenda
  protected readonly dias = proximosDias()
  protected readonly Math = Math
  protected readonly dia = signal<number | null>(null)
  protected readonly planesDelDia = (d: number) => this.filtrados().filter((p) => diaDe(p.when) === d).length
  protected readonly elegido = signal<string | null>(null)
  protected readonly detalle = computed(() => this.visible().find((p) => p.id === this.elegido()) ?? this.visible()[0])

  protected readonly visible = computed(() => {
    const d = this.dia()
    const list = d === null ? this.filtrados() : this.filtrados().filter((p) => diaDe(p.when) === d)
    return [...list].sort((a, b) => (diaDe(a.when) ?? 9) - (diaDe(b.when) ?? 9) || minutosDe(a.when) - minutosDe(b.when))
  })

  constructor() {
    // En celular, el botón central del dock crea un plan
    const quitar = inject(Mando).declarar({ label: 'Crear plan', run: () => this.creating.set(true) })
    inject(DestroyRef).onDestroy(quitar)
  }

  protected hora(when: string) {
    return when.match(/\d{1,2}:\d{2}/)?.[0] ?? ''
  }

  protected setDia(d: number | null) {
    runListTransition(this.appRef, () => {
      this.dia.set(this.dia() === d ? null : d)
      this.elegido.set(null)
    })
  }

  private readonly filtrados = computed(() => {
    const q = this.query().trim()
    return this.store.plans().filter((p) => {
      const z = zonaDe(p.place)
      return (
        !this.store.blocked().includes(p.hostId) &&
        (this.filter() === 'all' || p.intent === this.filter()) &&
        (this.sizeFilter() === 'all' || sizeOf(p.capacity) === this.sizeFilter()) &&
        (this.zone() === 'all' || z.zona === this.zone()) &&
        (this.colonia() === 'all' || z.colonia === this.colonia()) &&
        (!q || [p.title, p.place, p.description, personById(p.hostId)?.name ?? ''].some((t) => matches(t, q)))
      )
    })
  })

  protected onQuery(v: string) {
    this.query.set(v)
    this.active.set(-1)
  }

  protected onSearchKey(e: KeyboardEvent) {
    const n = this.suggestions().length
    if (e.key === 'ArrowDown' && n) {
      e.preventDefault()
      this.focused.set(true)
      this.active.update((i) => (i + 1) % n)
    } else if (e.key === 'ArrowUp' && n) {
      e.preventDefault()
      this.active.update((i) => (i <= 0 ? n - 1 : i - 1))
    } else if (e.key === 'Enter' && this.suggestOpen() && this.active() >= 0) {
      e.preventDefault()
      this.choose(this.suggestions()[this.active()].plan.title)
    } else if (e.key === 'Escape') {
      this.focused.set(false)
    }
  }

  protected choose(title: string) {
    this.query.set(title)
    this.active.set(-1)
    this.focused.set(false)
  }

  protected setZone(z: string) {
    runListTransition(this.appRef, () => {
      this.zone.set(z)
      this.colonia.set('all')
    })
  }

  protected setColonia(c: string) {
    runListTransition(this.appRef, () => this.colonia.set(c))
  }

  protected setFilter(next: Intent | 'all') {
    runListTransition(this.appRef, () => this.filter.set(next))
  }

  protected setSizeFilter(next: PlanSize | 'all') {
    runListTransition(this.appRef, () => this.sizeFilter.set(next))
  }

  protected sizeLabel(p: Plan) {
    return PLAN_SIZES[sizeOf(p.capacity)].label
  }

  protected audienceLabel(p: Plan) {
    return AUDIENCES[p.audience ?? 'any'].label
  }

  // Razón por la que este plan no admite a la persona, según a quién busca
  protected barrier(p: Plan) {
    if (p.hostId === 'me' || this.isJoined(p)) return null
    const me = this.store.me()
    if (p.audience === 'intent' && !me.intents.includes(p.intent)) return AUDIENCES.intent.blocked
    if (p.audience === 'interests' && !personById(p.hostId)?.interests.some((i) => me.interests.includes(i))) return AUDIENCES.interests.blocked
    return null
  }

  protected host(p: Plan) {
    return p.hostId === 'me' ? null : personById(p.hostId)
  }

  protected attendee(id: string) {
    return id === 'me' ? null : personById(id)
  }

  protected isJoined(p: Plan) {
    return this.store.joinedPlans().includes(p.id)
  }

  protected isFull(p: Plan) {
    return p.attendees.length >= p.capacity && !this.isJoined(p)
  }

  protected toggle(p: Plan, event: Event) {
    const joined = this.isJoined(p)
    if (this.store.toggleJoin(p.id) === 'unverified') return void this.verifyOpen.set(true)
    if (!joined) this.celebrate.play(p.intent, { at: event.currentTarget as Element })
    this.store.toast(joined ? 'Saliste del plan' : `Te uniste a "${p.title}"`, joined ? 'info' : 'ok')
  }
}
