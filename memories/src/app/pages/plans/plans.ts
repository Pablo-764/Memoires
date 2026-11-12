import { NgTemplateOutlet } from '@angular/common'
import { ApplicationRef, Component, computed, inject, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { AppStore } from '../../servicios/app-store'
import { Celebrate } from '../../servicios/celebrate'
import { runListTransition } from '../../utilidades/list-transition'
import { personById, type Plan } from '../../datos/mock'
import { INTENTS, INTENT_ORDER, INTENT_SHAPE, type Intent } from '../../modelos/intents'
import { AUDIENCES, PLAN_SIZES, SIZE_ORDER, sizeOf, type PlanSize } from '../../modelos/plan-formats'
import { Avatar } from '../../componentes/avatar/avatar'
import { Icon } from '../../componentes/icon/icon'
import { IntentBadge } from '../../componentes/intent-badge/intent-badge'
import { PillGroup } from '../../directivas/pill-group'
import { CreatePlanDialog } from '../../componentes/create-plan-dialog/create-plan-dialog'

import { PolaroidBoard, type BoardItem } from '../../componentes/polaroid-board/polaroid-board'
import { AsciiArt } from '../../componentes/ascii-art/ascii-art'
import { ASCII_BY_INTENT } from '../../datos/ascii'

// Fotos para los planes que no traen la suya
const FALLBACK = ['fotos/cafe.webp', 'fotos/correr.webp', 'fotos/juegos.webp', 'fotos/concierto.webp', 'fotos/biblioteca.webp']

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

  // Álbum: primero los planes propios y a los que te uniste; si no hay, los más recientes
  protected readonly album = computed<BoardItem[]>(() => {
    const all = this.store.plans().filter((p) => !this.store.blocked().includes(p.hostId))
    const mine = all.filter((p) => p.hostId === 'me' || this.isJoined(p))
    return (mine.length >= 3 ? mine : [...mine, ...all.filter((p) => !mine.includes(p))]).slice(0, 6).map((p, i) => ({
      photo: p.photo?.src ?? FALLBACK[i % FALLBACK.length],
      note: p.title,
      tone: p.intent,
    }))
  })

  protected readonly visible = computed(() =>
    this.store.plans().filter((p) => !this.store.blocked().includes(p.hostId) && (this.filter() === 'all' || p.intent === this.filter()) && (this.sizeFilter() === 'all' || sizeOf(p.capacity) === this.sizeFilter())),
  )

  // Dibujo de la tarjeta cuando el plan no tiene foto
  protected readonly asciiFor = (i: Intent) => ASCII_BY_INTENT[i]

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
