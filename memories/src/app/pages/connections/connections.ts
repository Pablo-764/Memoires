import { ApplicationRef, Component, DestroyRef, ElementRef, computed, inject, signal, viewChild } from '@angular/core'
import { RouterLink } from '@angular/router'
import { AppStore } from '../../servicios/app-store'
import { personById } from '../../datos/mock'
import { matches } from '../../utilidades/text-search'
import { Avatar } from '../../componentes/avatar/avatar'
import { Banner } from '../../componentes/banner/banner'
import { Icon } from '../../componentes/icon/icon'
import { IntentBadge } from '../../componentes/intent-badge/intent-badge'

import { Seal } from '../../componentes/seal/seal'
import { Modal } from '../../componentes/modal/modal'

const MODE_KEY = 'memoires-conexiones-vista'
function readMode(): 'cuadricula' | 'lista' {
  try {
    return localStorage.getItem(MODE_KEY) === 'lista' ? 'lista' : 'cuadricula'
  } catch {
    return 'cuadricula'
  }
}

type Confirm = { kind: 'silent' } | { kind: 'chat' | 'connection'; id: string; name: string }

@Component({
  selector: 'app-connections',
  imports: [RouterLink, Avatar, Banner, Icon, IntentBadge, Modal, Seal],
  styleUrl: './connections.css',
  templateUrl: './connections.html',
})
export class Connections {
  protected readonly store = inject(AppStore)
  protected readonly query = signal('')

  private readonly appRef = inject(ApplicationRef)
  private readonly grid = viewChild<ElementRef<HTMLElement>>('grid')
  private readonly still = matchMedia('(prefers-reduced-motion: reduce)').matches

  // Orden mientras se arrastra (se guarda al soltar) y quién se arrastra
  private readonly order = signal<string[] | null>(null)
  protected readonly dragging = signal<string | null>(null)
  protected readonly announce = signal('')
  protected readonly confirm = signal<Confirm | null>(null)
  // Cuadrícula para explorar o lista para comparar (dis-027)
  protected readonly mode = signal<'cuadricula' | 'lista'>(readMode())

  protected setMode(m: 'cuadricula' | 'lista') {
    this.mode.set(m)
    try {
      localStorage.setItem(MODE_KEY, m)
    } catch {
      /* sin almacenamiento: dura esta visita */
    }
  }

  protected readonly silentCount = computed(() => this.store.connections().filter((id) => !this.store.messages()[id]?.length).length)

  protected readonly all = computed(() =>
    (this.order() ?? this.store.connections()).flatMap((id) => {
      const person = personById(id)
      if (!person) return []
      const thread = this.store.messages()[id] ?? []
      const last = thread[thread.length - 1]
      return [{ person, thread, preview: last ? `${last.from === 'me' ? 'Tú: ' : ''}${last.text}` : 'Nueva conexión. Envía el primer mensaje.' }]
    }),
  )

  protected readonly rows = computed(() => {
    const q = this.query().trim()
    if (!q) return this.all()
    return this.all().flatMap((row) => {
      const message = row.thread.filter((m) => matches(m.text, q)).at(-1)
      if (message) return [{ ...row, preview: `${message.from === 'me' ? 'Tú: ' : ''}${message.text}` }]
      return matches(row.person.name, q) || row.person.interests.some((i) => matches(i, q)) ? [row] : []
    })
  })

  constructor() {
    inject(DestroyRef).onDestroy(() => this.stopDrag?.())
  }

  protected apply(c: Confirm) {
    if (c.kind === 'silent') {
      const n = this.store.removeSilentConnections()
      this.store.toast(n === 1 ? 'Quitaste 1 conexión sin mensajes.' : `Quitaste ${n} conexiones sin mensajes.`)
    } else if (c.kind === 'chat') {
      this.store.clearChat(c.id)
      this.store.toast(`Borraste el chat con ${c.name}.`)
    } else {
      this.store.removeConnection(c.id)
      this.store.toast(`${c.name} ya no está en tus conexiones.`)
    }
    this.confirm.set(null)
  }

  // ---------- Reordenar ----------
  private stopDrag: (() => void) | null = null

  private cards() {
    return [...(this.grid()?.nativeElement.querySelectorAll<HTMLElement>(':scope > li[data-id]') ?? [])]
  }

  /** Cambia el orden y anima a las demás tarjetas desde donde estaban (FLIP). */
  private reorder(next: string[], skip?: string) {
    const before = new Map(this.cards().map((el) => [el.dataset['id']!, el.getBoundingClientRect()]))
    this.order.set(next)
    this.appRef.tick()
    if (this.still) return
    for (const el of this.cards()) {
      const id = el.dataset['id']!
      const was = before.get(id)
      if (!was || id === skip) continue
      const now = el.getBoundingClientRect()
      const dx = was.left - now.left
      const dy = was.top - now.top
      if (dx || dy) el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: 280, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' })
    }
  }

  /**
   * Arrastrar desde la agarradera: la tarjeta sigue al cursor, se inclina según la velocidad
   * (como las fotos del tablero) y las demás se hacen a un lado. Al soltar se acomoda con rebote.
   */
  protected grab(e: PointerEvent, id: string) {
    if (e.button !== 0) return
    const handle = e.currentTarget as HTMLElement
    const card = handle.closest<HTMLElement>('li')!
    e.preventDefault()
    // Al reordenar, la tarjeta cambia de lugar en el DOM y perdería la captura: se escucha en la ventana
    this.order.set(this.store.connections())
    this.dragging.set(id)
    let tx = 0
    let ty = 0
    let rot = 0
    let lx = e.clientX
    let lt = performance.now()
    const start = card.getBoundingClientRect()
    const offX = e.clientX - start.left
    const offY = e.clientY - start.top

    const place = () => (card.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) rotate(${rot.toFixed(2)}deg) scale(1.03)`)
    const follow = (x: number, y: number) => {
      card.style.transform = ''
      const base = card.getBoundingClientRect()
      tx = x - offX - base.left
      ty = y - offY - base.top
      place()
    }

    const move = (ev: PointerEvent) => {
      const now = performance.now()
      const vx = ((ev.clientX - lx) / Math.max(1, now - lt)) * 16
      lx = ev.clientX
      lt = now
      if (!this.still) rot += (Math.max(-10, Math.min(10, vx * 0.8)) - rot) * 0.25
      // ¿Sobre qué tarjeta está el cursor? Ahí se acomoda la que se arrastra
      const over = this.cards().find((el) => {
        if (el === card) return false
        const r = el.getBoundingClientRect()
        return ev.clientX > r.left && ev.clientX < r.right && ev.clientY > r.top && ev.clientY < r.bottom
      })
      const list = this.order()!
      if (over) {
        const to = list.indexOf(over.dataset['id']!)
        if (to !== list.indexOf(id)) {
          const next = list.filter((x) => x !== id)
          next.splice(to, 0, id)
          this.reorder(next, id)
        }
      }
      follow(ev.clientX, ev.clientY)
    }

    const end = () => {
      removeEventListener('pointermove', move)
      removeEventListener('pointerup', end)
      removeEventListener('pointercancel', end)
      this.stopDrag = null
      const final = this.order() ?? this.store.connections()
      this.store.setConnectionOrder(final)
      this.order.set(null)
      this.dragging.set(null)
      const from = card.style.transform
      card.style.transform = ''
      if (!this.still && from) {
        card.animate([{ transform: from }, { transform: 'none' }], { duration: 460, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' })
      }
      const name = personById(id)?.name ?? ''
      this.announce.set(`${name} quedó en la posición ${final.indexOf(id) + 1} de ${final.length}.`)
    }

    addEventListener('pointermove', move)
    addEventListener('pointerup', end)
    addEventListener('pointercancel', end)
    this.stopDrag = end
  }

  // Con teclado: flechas para mover una posición
  protected nudge(e: KeyboardEvent, id: string) {
    const step = e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : 0
    if (!step) return
    e.preventDefault()
    const list = this.store.connections()
    const from = list.indexOf(id)
    const to = Math.max(0, Math.min(list.length - 1, from + step))
    if (to === from) return
    const next = list.filter((x) => x !== id)
    next.splice(to, 0, id)
    this.reorder(next)
    this.store.setConnectionOrder(next)
    this.order.set(null)
    this.announce.set(`${personById(id)?.name ?? ''} quedó en la posición ${to + 1} de ${next.length}.`)
    // La agarradera conserva el foco tras volver a pintar la lista
    queueMicrotask(() => this.grid()?.nativeElement.querySelector<HTMLElement>(`li[data-id="${id}"] .conn-grip`)?.focus())
  }
}
