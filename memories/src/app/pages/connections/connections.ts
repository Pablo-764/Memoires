import { Component, computed, inject, signal } from '@angular/core'
import { NgTemplateOutlet } from '@angular/common'
import { RouterLink } from '@angular/router'
import { AppStore } from '../../servicios/app-store'
import { PAST_PLANS, personById, type Person, type Message } from '../../datos/mock'
import { matches } from '../../utilidades/text-search'
import { ETAPAS, etapaDe, grosorHilo, type Etapa } from '../../utilidades/etapas'
import type { Intent } from '../../modelos/intents'
import { Avatar } from '../../componentes/avatar/avatar'
import { Icon } from '../../componentes/icon/icon'
import { IntentBadge } from '../../componentes/intent-badge/intent-badge'

const MODE_KEY = 'memoires-conexiones-vista'
function readMode(): 'tablero' | 'lista' {
  try {
    return localStorage.getItem(MODE_KEY) === 'lista' ? 'lista' : 'tablero'
  } catch {
    return 'tablero'
  }
}

interface Cinta {
  person: Person
  intent: Intent
  stage: Etapa
  shared: string[]
  preview: string
  next: string | null
  thread: Message[]
  width: number
}

type Confirm = { kind: 'chat' | 'connection'; id: string } | null

@Component({
  selector: 'app-connections',
  imports: [NgTemplateOutlet, RouterLink, Avatar, Icon, IntentBadge],
  styleUrl: './connections.css',
  templateUrl: './connections.html',
})
export class Connections {
  protected readonly store = inject(AppStore)
  protected readonly query = signal('')
  protected readonly etapas = ETAPAS
  // Tablero por etapas o lista para comparar (dis-027)
  protected readonly mode = signal<'tablero' | 'lista'>(readMode())
  protected readonly confirm = signal<Confirm>(null)
  protected readonly dragging = signal<string | null>(null)
  protected readonly over = signal<Etapa | null>(null)
  protected readonly announce = signal('')

  protected readonly all = computed<Cinta[]>(() => {
    const s = this.store
    const me = s.me()
    return s.connections().flatMap((id) => {
      const person = personById(id)
      if (!person) return []
      const thread = s.messages()[id] ?? []
      const last = thread.at(-1)
      const plan = [...thread].reverse().find((m) => m.plan && m.plan.status !== 'movido')?.plan
      const joined = s.plans().find((p) => p.attendees.includes('me') && (p.attendees.includes(id) || p.hostId === id))
      const cumplidos = PAST_PLANS.filter((p) => p.people.includes(id)).length
      return [
        {
          person,
          intent: person.intents.find((i) => me.intents.includes(i)) ?? person.intents[0],
          stage: etapaDe(id, thread, s.plans(), PAST_PLANS, s.stages()[id]),
          shared: person.interests.filter((i) => me.interests.includes(i)).slice(0, 3),
          preview: last ? `${last.from === 'me' ? 'Tú: ' : ''}${last.text}` : 'Nueva conexión. Escríbele primero.',
          next: plan ? `${plan.title} · ${plan.when}` : joined ? `${joined.title} · ${joined.when}` : null,
          thread,
          width: grosorHilo(thread.length, cumplidos),
        },
      ]
    })
  })

  protected readonly rows = computed(() => {
    const q = this.query().trim()
    if (!q) return this.all()
    return this.all().filter((r) => matches(r.person.name, q) || r.person.interests.some((i) => matches(i, q)) || r.thread.some((m) => matches(m.text, q)))
  })

  // Pestaña visible en celular: la elegida o la primera etapa con alguien
  protected readonly tabChoice = signal<Etapa | null>(null)
  protected readonly tab = computed<Etapa>(() => this.tabChoice() ?? ETAPAS.find((e) => this.byStage()[e.key].length)?.key ?? 'nueva')

  protected readonly byStage = computed(() => Object.fromEntries(ETAPAS.map((e) => [e.key, this.rows().filter((r) => r.stage === e.key)])) as Record<Etapa, Cinta[]>)

  protected setMode(m: 'tablero' | 'lista') {
    this.mode.set(m)
    try {
      localStorage.setItem(MODE_KEY, m)
    } catch {
      /* sin almacenamiento: dura esta visita */
    }
  }

  protected move(id: string, stage: Etapa) {
    this.store.setStage(id, stage)
    const name = personById(id)?.name ?? ''
    this.announce.set(`${name} pasó a ${ETAPAS.find((e) => e.key === stage)?.label}.`)
  }

  // Arrastrar una cinta a otra columna (con teclado: el menú "Mover a")
  protected onDragStart(e: DragEvent, id: string) {
    this.dragging.set(id)
    e.dataTransfer?.setData('text/plain', id)
    if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
  }

  protected onDrop(e: DragEvent, stage: Etapa) {
    e.preventDefault()
    const id = e.dataTransfer?.getData('text/plain') || this.dragging()
    if (id) this.move(id, stage)
    this.dragging.set(null)
    this.over.set(null)
  }

  protected apply(c: NonNullable<Confirm>) {
    const name = personById(c.id)?.name ?? ''
    if (c.kind === 'chat') {
      this.store.clearChat(c.id)
      this.store.toast(`Borraste el chat con ${name}.`)
    } else {
      this.store.removeConnection(c.id)
      this.store.toast(`${name} ya no está en tus conexiones.`)
    }
    this.confirm.set(null)
  }
}
