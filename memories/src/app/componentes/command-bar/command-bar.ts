import { Component, DestroyRef, ElementRef, afterNextRender, computed, inject, input, signal } from '@angular/core'
import { Router, RouterLink } from '@angular/router'
import { AppStore } from '../../servicios/app-store'
import { ThemeService } from '../../servicios/theme'
import { Mando } from '../../servicios/mando'
import { personById } from '../../datos/mock'
import type { NavItem } from '../../modelos/navegacion'
import { TIERS } from '../../modelos/plans'
import { Avatar } from '../avatar/avatar'
import { Icon } from '../icon/icon'
import { PillGroup } from '../../directivas/pill-group'

interface Aviso {
  id: string
  text: string
  to: string
}

/**
 * Barra de mando flotante (escritorio): monograma, los 4 destinos en un segmentado con
 * indicador que se desliza, paleta de comandos, avisos y el avatar con su menú (plan,
 * tema, ajustes, privacidad y salir). Se esconde al bajar y vuelve al subir.
 */
@Component({
  selector: 'app-command-bar',
  imports: [RouterLink, Avatar, Icon, PillGroup],
  styleUrl: './command-bar.css',
  templateUrl: './command-bar.html',
  host: {
    '(document:keydown)': 'onKey($event)',
    '(document:click)': 'onDocClick($event)',
  },
})
export class CommandBar {
  readonly items = input.required<NavItem[]>()
  readonly active = input.required<number>()

  protected readonly store = inject(AppStore)
  protected readonly theme = inject(ThemeService)
  protected readonly mando = inject(Mando)
  private readonly router = inject(Router)
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement

  protected readonly hidden = signal(false)
  protected readonly menu = signal<'avatar' | 'avisos' | null>(null)
  protected readonly tier = computed(() => TIERS[this.store.tier()])
  protected readonly name = computed(() => this.store.me().name || 'Tú')
  protected readonly mac = typeof navigator !== 'undefined' && /Mac/i.test(navigator.platform)

  // Avisos: conexiones nuevas sin mensajes y planes a los que te uniste
  protected readonly avisos = computed<Aviso[]>(() => {
    const s = this.store
    const nuevas = s
      .connections()
      .filter((id) => !s.messages()[id]?.length)
      .slice(0, 3)
      .flatMap((id) => {
        const p = personById(id)
        return p ? [{ id: 'c-' + id, text: `${p.name} y tú conectaron. Escríbele primero.`, to: '/app/chat/' + id }] : []
      })
    const planes = s
      .plans()
      .filter((p) => s.joinedPlans().includes(p.id))
      .slice(0, 2)
      .map((p) => ({ id: 'p-' + p.id, text: `${p.title}: ${p.when}`, to: '/app/planes' }))
    return [...nuevas, ...planes]
  })

  constructor() {
    const destroyRef = inject(DestroyRef)
    afterNextRender(() => {
      let last = scrollY
      const onScroll = () => {
        const y = scrollY
        if (Math.abs(y - last) < 6) return
        this.hidden.set(y > last && y > 120)
        if (y > last) this.menu.set(null)
        last = y
      }
      addEventListener('scroll', onScroll, { passive: true })
      destroyRef.onDestroy(() => removeEventListener('scroll', onScroll))
    })
  }

  protected toggle(m: 'avatar' | 'avisos') {
    this.menu.update((x) => (x === m ? null : m))
  }

  protected onKey(e: KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault()
      this.mando.abrirPaleta()
    } else if (e.key === 'Escape') {
      this.menu.set(null)
    }
  }

  protected onDocClick(e: Event) {
    if (this.menu() && !this.host.contains(e.target as Node)) this.menu.set(null)
  }

  protected switchTheme(e: MouseEvent) {
    this.theme.set(this.theme.mode() === 'dark' ? 'light' : 'dark', { x: e.clientX, y: e.clientY })
  }

  protected logout() {
    this.menu.set(null)
    this.store.logout()
    this.router.navigateByUrl('/')
  }
}
