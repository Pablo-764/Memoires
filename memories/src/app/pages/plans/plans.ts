import { NgTemplateOutlet } from '@angular/common'
import { ApplicationRef, Component, computed, inject, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { AppStore } from '../../servicios/app-store'
import { Celebrate } from '../../servicios/celebrate'
import { runListTransition } from '../../utilidades/list-transition'
import { PAST_PLANS, personById, type Plan } from '../../datos/mock'
import { INTENTS, INTENT_ORDER, INTENT_SHAPE, type Intent } from '../../modelos/intents'
import { AUDIENCES, PLAN_SIZES, SIZE_ORDER, sizeOf, type PlanSize } from '../../modelos/plan-formats'
import { Avatar } from '../../componentes/avatar/avatar'
import { Icon } from '../../componentes/icon/icon'
import { IntentBadge } from '../../componentes/intent-badge/intent-badge'
import { PillGroup } from '../../directivas/pill-group'
import { CreatePlanDialog } from '../../componentes/create-plan-dialog/create-plan-dialog'

import { PolaroidBoard, type BoardItem } from '../../componentes/polaroid-board/polaroid-board'
import { AsciiArt } from '../../componentes/ascii-art/ascii-art'
import { asciiForPlan } from '../../datos/ascii'

// Fotos para los planes que no traen la suya

@Component({
  selector: 'app-plans',
  imports: [AsciiArt, NgTemplateOutlet, RouterLink, Avatar, Icon, IntentBadge, PillGroup, CreatePlanDialog, PolaroidBoard],
  styleUrl: './plans.css',
  templateUrl: './plans.html',
})
export class Plans {
  protected readonly store = inject(AppStore)
  private readonly appRef = inject(ApplicationRef)
  private readonly celebrate = inject(Celebrate)
  protected readonly intents = INTENTS
  protected readonly filterOptions = INTENT_ORDER.filter((i) => i !== 'romance')
  protected readonly creating = signal(false)
  protected readonly filter = signal<Intent | 'all'>('all')
  protected readonly sizeFilter = signal<PlanSize | 'all'>('all')
  protected readonly shapes = INTENT_SHAPE
  protected readonly sizeLook: Record<PlanSize, { shape: string; tone: string }> = {
    duo: { shape: 'pill', tone: 'romance' },
    small: { shape: 'leaf', tone: 'plan' },
    large: { shape: 'square', tone: 'hobby' },
  }
  protected readonly sizes = SIZE_ORDER
  protected readonly sizeInfo = PLAN_SIZES
  protected readonly audienceInfo = AUDIENCES

  // Planes cumplidos: foto en tramado (o la nota a mano si no hay), fecha e iniciales de quienes fueron
  protected readonly album = computed<BoardItem[]>(() =>
    PAST_PLANS.filter((p) => !p.people.some((id) => this.store.blocked().includes(id))).map((p) => ({
      photo: p.photo,
      note: p.title,
      tone: p.intent,
      date: `${p.date} ${p.time}`,
      people: p.people.map((id) => (id === 'me' ? 'TÚ' : (personById(id)?.name[0] ?? '?'))),
    })),
  )

  protected readonly visible = computed(() =>
    this.store.plans().filter((p) => !this.store.blocked().includes(p.hostId) && (this.filter() === 'all' || p.intent === this.filter()) && (this.sizeFilter() === 'all' || sizeOf(p.capacity) === this.sizeFilter())),
  )

  // Dibujo de la tarjeta cuando el plan no tiene foto
  protected readonly asciiFor = (text: string, i: Intent) => asciiForPlan(text, i)

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
    this.store.toggleJoin(p.id)
    if (!joined) this.celebrate.play(p.intent, { at: event.currentTarget as Element })
    this.store.toast(joined ? 'Saliste del plan' : `Te uniste a "${p.title}"`, joined ? 'info' : 'ok')
  }
}
