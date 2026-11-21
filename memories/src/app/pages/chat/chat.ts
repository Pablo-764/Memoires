import { VerifySheet } from '../../componentes/verify-sheet/verify-sheet'
import { palabrasDelicadas } from '../../utilidades/cuidado'
import { aperturasDe } from '../../modelos/aperturas'
import { Component, DestroyRef, ElementRef, afterRenderEffect, computed, effect, inject, input, signal, untracked, viewChild } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { AppStore } from '../../servicios/app-store'
import { personById } from '../../datos/mock'
import { countWords } from '../../utilidades/matching'
import { highlight, matches } from '../../utilidades/text-search'
import { Celebrate } from '../../servicios/celebrate'
import { Avatar } from '../../componentes/avatar/avatar'
import { Icon } from '../../componentes/icon/icon'
import { Modal } from '../../componentes/modal/modal'
import { BlockDialog } from '../../componentes/block-dialog/block-dialog'
import { ReportDialog } from '../../componentes/report-dialog/report-dialog'
import { Seal } from '../../componentes/seal/seal'
import { ChoiceChip } from '../../componentes/choice-chip/choice-chip'
import { ideasDePlan, type PlanPropuesto } from '../../utilidades/etapas'
import { INTENTS, type Intent } from '../../modelos/intents'

@Component({
  selector: 'app-chat',
  imports: [Seal, ChoiceChip, FormsModule, RouterLink, Avatar, Icon, Modal, BlockDialog, ReportDialog, VerifySheet],
  styleUrl: './chat.css',
  templateUrl: './chat.html',
})
export class Chat {
  readonly id = input('')

  protected readonly store = inject(AppStore)
  protected readonly verifyOpen = signal(false)
  protected readonly router = inject(Router)
  private readonly celebrate = inject(Celebrate)
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement

  protected readonly person = computed(() => {
    const p = personById(this.id())
    return p && this.store.connections().includes(this.id()) ? p : undefined
  })
  protected readonly thread = computed(() => this.store.messages()[this.id()] ?? [])

  protected readonly searching = signal(false)
  protected readonly query = signal('')
  protected readonly hits = computed(() => this.thread().filter((m) => matches(m.text, this.query())).length)

  protected readonly text = signal('')
  /** Palabras que pueden lastimar en el mensaje que se iba a enviar (pide confirmar). */
  protected readonly delicadas = signal<string[]>([])
  /** Imágenes que la persona decidió ver (llegan difuminadas). */
  protected readonly vistas = signal<Set<string>>(new Set())
  // Primeros pasos de la otra persona: se contestan con un toque
  protected readonly aperturas = computed(() => aperturasDe(this.id()))
  protected readonly verAperturas = computed(() => this.thread().filter((m) => m.from === 'me').length < 3)
  protected readonly words = computed(() => countWords(this.text()))
  protected readonly reportOpen = signal(false)
  protected readonly blockOpen = signal(false)

  // Intención y lo que comparten: dan el color y las sugerencias de plan
  protected readonly intent = computed<Intent>(() => {
    const p = this.person()
    return p ? (p.intents.find((i) => this.store.me().intents.includes(i)) ?? p.intents[0]) : 'friend'
  })
  protected readonly shared = computed(() => this.person()?.interests.filter((i) => this.store.me().interests.includes(i)) ?? [])
  protected readonly ideas = computed(() => {
    const p = this.person()
    if (!p) return []
    const ya = new Set(this.thread().flatMap((m) => (m.plan ? [m.plan.title] : [])))
    return ideasDePlan(this.store.me().interests, p, this.intent()).filter((i) => !ya.has(i.title))
  })
  protected readonly intents = INTENTS
  protected readonly intentKeys = Object.keys(INTENTS) as Intent[]

  // Hoja "Proponer plan": fecha, lugar y tipo
  protected readonly proposing = signal(false)
  protected readonly draft = signal<Omit<PlanPropuesto, 'status'>>({ title: '', when: 'Sábado 11:00', place: '', intent: 'friend' })
  protected readonly cuandos = ['Viernes 19:30', 'Sábado 11:00', 'Sábado 18:00', 'Domingo 9:00']
  protected readonly moving = signal<string | null>(null)

  protected openPropose(idea?: Omit<PlanPropuesto, 'status'>) {
    this.draft.set(idea ?? { title: '', when: 'Sábado 11:00', place: '', intent: this.intent() })
    this.proposing.set(true)
  }

  protected patchDraft(change: Partial<Omit<PlanPropuesto, 'status'>>) {
    this.draft.update((d) => ({ ...d, ...change }))
  }

  protected sendProposal() {
    const d = this.draft()
    if (!d.title.trim() || !d.place.trim()) return
    if (!this.store.verified()) {
      this.proposing.set(false)
      return void this.verifyOpen.set(true)
    }
    this.store.proposePlan(this.id(), { ...d, title: d.title.trim(), place: d.place.trim() })
    this.proposing.set(false)
    this.store.toast('Plan propuesto', 'ok')
  }

  protected movePlan(messageId: string, when: string) {
    this.store.movePlan(this.id(), messageId, when)
    this.moving.set(null)
  }

  private readonly end = viewChild<ElementRef<HTMLElement>>('end')
  private readonly sendBtn = viewChild<ElementRef<HTMLElement>>('sendBtn')
  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput')
  private readonly msgBox = viewChild<ElementRef<HTMLTextAreaElement>>('msgBox')

  constructor() {
    // La caja de mensaje crece con el texto (sin barra de scroll hasta llegar al tope).
    // Donde el navegador no soporta field-sizing, se ajusta la altura a mano.
    const autoSize = typeof CSS === 'undefined' || !CSS.supports('field-sizing', 'content')
    afterRenderEffect(() => {
      this.text()
      const el = this.msgBox()?.nativeElement
      if (!el || !autoSize) return
      el.style.height = 'auto'
      el.style.height = `${el.scrollHeight}px`
    })
    effect(() => {
      const p = this.person()
      this.store.backdropTone.set(p ? (p.intents.find((i) => this.store.me().intents.includes(i)) ?? p.intents[0]) : null)
    })
    inject(DestroyRef).onDestroy(() => this.store.backdropTone.set(null))

    afterRenderEffect(() => {
      this.thread()
      this.store.typing()
      if (!untracked(this.query).trim()) this.end()?.nativeElement.scrollIntoView({ block: 'end' })
    })

    afterRenderEffect(() => {
      this.searchInput()?.nativeElement.focus()
    })

    afterRenderEffect(() => {
      if (this.query().trim()) this.host.querySelector('.msg-hit')?.scrollIntoView({ block: 'center' })
    })
  }

  protected isHit(text: string) {
    return matches(text, this.query())
  }

  protected parts(text: string) {
    return highlight(text, this.query())
  }

  protected toggleSearch() {
    this.searching.update((v) => !v)
    this.query.set('')
  }

  protected submit(force = false) {
    const body = this.text().trim()
    if (!body) return
    if (!force) {
      const d = palabrasDelicadas(body)
      if (d.length) return void this.delicadas.set(d)
    }
    this.delicadas.set([])
    if (this.store.sendMessage(this.id(), body) === 'unverified') return void this.verifyOpen.set(true)
    this.text.set('')
    this.celebrate.play('send', { at: this.sendBtn()?.nativeElement })
  }

  protected verImagen(id: string) {
    this.vistas.update((s) => new Set(s).add(id))
  }

  protected responder(q: string) {
    this.text.set(`${q} `)
    const el = this.msgBox()?.nativeElement
    el?.focus()
    el?.setSelectionRange(el.value.length, el.value.length)
  }

  protected onKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      ;(e.target as HTMLTextAreaElement).form?.requestSubmit()
    }
  }
}
