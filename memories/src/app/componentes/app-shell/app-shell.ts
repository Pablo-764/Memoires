import { Component, DestroyRef, computed, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { NavigationEnd, Router, RouterOutlet } from '@angular/router'
import { filter, map } from 'rxjs'
import { AppStore } from '../../servicios/app-store'
import { Celebrate } from '../../servicios/celebrate'
import { personById } from '../../datos/mock'
import { INTENT_ICON } from '../../modelos/intents'
import { NAV_ITEMS } from '../../modelos/navegacion'
import { Avatar } from '../avatar/avatar'
import { Modal } from '../modal/modal'
import { CommandBar } from '../command-bar/command-bar'
import { CommandPalette } from '../command-palette/command-palette'
import { Dock } from '../dock/dock'
import { Mando } from '../../servicios/mando'
import { VerifySheet } from '../verify-sheet/verify-sheet'

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, Avatar, Modal, CommandBar, CommandPalette, Dock, VerifySheet],
  styleUrl: './app-shell.css',
  templateUrl: './app-shell.html',
})
export class AppShell {
  protected readonly store = inject(AppStore)
  protected readonly mando = inject(Mando)
  private readonly router = inject(Router)
  private readonly celebrate = inject(Celebrate)

  // Descubre muestra el icono de lo que la persona más busca
  protected readonly nav = computed(() => NAV_ITEMS.map((n, i) => (i === 0 ? { ...n, icon: INTENT_ICON[this.store.preferredIntent()] } : n)))

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  )

  // Cada sección vive en una hoja de distinto color (descubre, conexiones, planes, perfil…)
  protected readonly page = computed(() => this.url().split('?')[0].split('/')[2] ?? 'descubre')

  protected readonly activeIndex = computed(() => {
    const url = this.url()
    return NAV_ITEMS.findIndex((n) => url.startsWith(n.to) || (!!n.also && url.startsWith(n.also)))
  })

  protected readonly displayName = computed(() => this.store.me().name || 'Tú')

  protected readonly nudgeOpen = computed(
    () => this.store.minutesToday() >= this.store.limitMinutes() && this.store.minutesToday() >= this.store.snoozedUntilMinute(),
  )
  protected readonly matchPerson = computed(() => {
    const id = this.store.lastMatch()
    return id ? personById(id) : undefined
  })

  constructor() {
    // Cuenta los minutos de uso mientras la pestaña está visible
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') this.store.tickMinute()
    }, 60_000)
    inject(DestroyRef).onDestroy(() => window.clearInterval(id))
  }

  protected skipToContent(e: Event) {
    e.preventDefault()
    document.getElementById('contenido')?.focus()
  }

  protected takeBreak() {
    this.store.snooze(24 * 60)
    this.celebrate.play('wellbeing', { giant: true }).then(() => {
      this.store.logout()
      this.router.navigateByUrl('/descanso')
    })
  }

  protected openMatchChat(id: string) {
    this.store.clearMatch()
    this.router.navigate(['/app/chat', id])
  }
}
