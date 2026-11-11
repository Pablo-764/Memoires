import { ApplicationRef, Component, computed, inject, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { AppStore } from '../../servicios/app-store'
import { Celebrate } from '../../servicios/celebrate'
import { runListTransition } from '../../utilidades/list-transition'
import { personById, type Report } from '../../datos/mock'
import { Avatar } from '../../componentes/avatar/avatar'
import { Logo } from '../../componentes/logo/logo'

const STATUS_STYLE: Record<Report['status'], string> = {
  pendiente: 'bg-friend-soft text-friend',
  descartado: 'bg-mist text-ink-mute',
  advertido: 'bg-hobby-soft text-hobby',
  suspendido: 'bg-danger-soft text-danger',
}

function timeAgo(t: number) {
  const m = Math.round((Date.now() - t) / 60000)
  if (m < 60) return `hace ${m} min`
  const h = Math.round(m / 60)
  return h < 24 ? `hace ${h} h` : `hace ${Math.round(h / 24)} d`
}

@Component({
  selector: 'app-admin',
  imports: [RouterLink, Avatar, Logo],
  styleUrl: './admin.css',
  templateUrl: './admin.html',
})
export class Admin {
  protected readonly store = inject(AppStore)
  private readonly celebrate = inject(Celebrate)
  private readonly appRef = inject(ApplicationRef)
  protected readonly statusStyle = STATUS_STYLE
  protected readonly person = personById
  protected readonly timeAgo = timeAgo
  protected readonly tab = signal<'pendiente' | 'todos'>('pendiente')

  private readonly pending = computed(() => this.store.reports().filter((r) => r.status === 'pendiente'))
  protected readonly list = computed(() => (this.tab() === 'pendiente' ? this.pending() : this.store.reports()))
  protected readonly pendingText = computed(() => {
    const n = this.pending().length
    return n === 0 ? 'No hay reportes pendientes.' : `${n} ${n === 1 ? 'reporte pendiente' : 'reportes pendientes'} de revisión.`
  })

  protected setTab(next: 'pendiente' | 'todos') {
    runListTransition(this.appRef, () => this.tab.set(next))
  }

  private apply(id: string, status: Report['status']) {
    runListTransition(this.appRef, () => this.store.moderate(id, status))
  }

  protected discard(id: string) {
    this.apply(id, 'descartado')
    this.store.toast('Reporte descartado')
  }

  protected warn(id: string) {
    this.apply(id, 'advertido')
    this.store.toast('Se envió una advertencia', 'ok')
  }

  protected suspend(id: string, name?: string) {
    this.apply(id, 'suspendido')
    this.celebrate.play('block')
    this.store.toast(`${name ?? 'La cuenta'} fue suspendida`, 'danger')
  }
}
