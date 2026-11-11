import { Component, DestroyRef, ElementRef, afterRenderEffect, computed, effect, inject, input, signal, untracked, viewChild } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { AppStore } from '../../servicios/app-store'
import { personById } from '../../datos/mock'
import { countWords } from '../../utilidades/matching'
import { highlight, matches } from '../../utilidades/text-search'
import { TIERS } from '../../modelos/plans'
import { Celebrate } from '../../servicios/celebrate'
import { Avatar } from '../../componentes/avatar/avatar'
import { Banner } from '../../componentes/banner/banner'
import { Icon } from '../../componentes/icon/icon'
import { Meter } from '../../componentes/meter/meter'
import { Modal } from '../../componentes/modal/modal'
import { BlockDialog } from '../../componentes/block-dialog/block-dialog'
import { ReportDialog } from '../../componentes/report-dialog/report-dialog'

@Component({
  selector: 'app-chat',
  imports: [FormsModule, RouterLink, Avatar, Banner, Icon, Meter, Modal, BlockDialog, ReportDialog],
  styleUrl: './chat.css',
  templateUrl: './chat.html',
})
export class Chat {
  readonly id = input('')

  protected readonly store = inject(AppStore)
  protected readonly router = inject(Router)
  private readonly celebrate = inject(Celebrate)
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement

  protected readonly person = computed(() => {
    const p = personById(this.id())
    return p && this.store.connections().includes(this.id()) ? p : undefined
  })
  protected readonly thread = computed(() => this.store.messages()[this.id()] ?? [])
  protected readonly tierInfo = computed(() => TIERS[this.store.tier()])
  protected readonly total = computed(() => this.tierInfo().weeklyWords)
  protected readonly totalText = computed(() => (Number.isFinite(this.total()) ? this.total().toLocaleString('es-MX') : 'ilimitadas'))

  protected readonly searching = signal(false)
  protected readonly query = signal('')
  protected readonly hits = computed(() => this.thread().filter((m) => matches(m.text, this.query())).length)

  protected readonly text = signal('')
  protected readonly words = computed(() => countWords(this.text()))
  protected readonly reportOpen = signal(false)
  protected readonly blockOpen = signal(false)
  protected readonly limitOpen = signal(false)

  private readonly end = viewChild<ElementRef<HTMLElement>>('end')
  private readonly sendBtn = viewChild<ElementRef<HTMLElement>>('sendBtn')
  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput')

  constructor() {
    effect(() => {
      const p = this.person()
      this.store.ambient.set(p ? `color-mix(in oklab, hsl(${p.hue} 62% 58%) 14%, var(--color-mist))` : null)
    })
    inject(DestroyRef).onDestroy(() => this.store.ambient.set(null))

    afterRenderEffect(() => {
      this.thread().length
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

  protected submit() {
    const body = this.text().trim()
    if (!body) return
    if (this.store.sendMessage(this.id(), body) === 'limit') this.limitOpen.set(true)
    else {
      this.text.set('')
      this.celebrate.play('send', { at: this.sendBtn()?.nativeElement })
    }
  }

  protected onKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      ;(e.target as HTMLTextAreaElement).form?.requestSubmit()
    }
  }
}
