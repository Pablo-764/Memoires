import { ApplicationRef, Component, computed, inject } from '@angular/core'
import { RouterLink } from '@angular/router'
import { AppStore } from '../../servicios/app-store'
import { Celebrate } from '../../servicios/celebrate'
import { runListTransition } from '../../utilidades/list-transition'
import { personById, type Report } from '../../datos/mock'
import { Avatar } from '../../componentes/avatar/avatar'
import { Seal } from '../../componentes/seal/seal'
import { Logo } from '../../componentes/logo/logo'
import { Icon } from '../../componentes/icon/icon'

const STATUS_STYLE: Record<Report['status'], string> = {
  pendiente: 'bg-friend-wash text-friend',
  descartado: 'bg-paper text-ink-3',
  advertido: 'bg-hobby-wash text-hobby',
  suspendido: 'bg-danger-wash text-danger',
}

export type Prioridad = 'alta' | 'media' | 'baja'

/** Prioridad de la cola: riesgo del motivo, reportes acumulados y antigüedad. */
export function prioridadDe(r: Report, todos: Report[]): { nivel: Prioridad; puntos: number } {
  const motivo = r.reason.toLowerCase()
  let puntos = /menor|acoso|ofensiv/.test(motivo) ? 60 : /falso|inapropiado/.test(motivo) ? 40 : 15
  puntos += (todos.filter((x) => x.reportedId === r.reportedId).length - 1) * 20
  puntos += Math.min(20, (Date.now() - r.at) / 3_600_000)
  return { nivel: puntos >= 55 ? 'alta' : puntos >= 35 ? 'media' : 'baja', puntos }
}

function timeAgo(t: number) {
  const m = Math.round((Date.now() - t) / 60000)
  if (m < 60) return `hace ${m} min`
  const h = Math.round(m / 60)
  return h < 24 ? `hace ${h} h` : `hace ${Math.round(h / 24)} d`
}

@Component({
  selector: 'app-admin',
  imports: [RouterLink, Avatar, Logo, Seal, Icon],
  styleUrl: './admin.css',
  templateUrl: './admin.html',
  host: { '(document:keydown)': 'onKey($event)' },
})
export class Admin {
  protected readonly store = inject(AppStore)
  private readonly celebrate = inject(Celebrate)
  private readonly appRef = inject(ApplicationRef)
  protected readonly statusStyle = STATUS_STYLE
  protected readonly person = personById
  protected readonly timeAgo = timeAgo

  // Cola de trabajo: lo pendiente, ordenado por prioridad
  private readonly pending = computed(() => {
    const todos = this.store.reports()
    return todos
      .filter((r) => r.status === 'pendiente')
      .map((r) => ({ r, p: prioridadDe(r, todos) }))
      .sort((a, b) => b.p.puntos - a.p.puntos)
      .map((x) => x.r)
  })
  protected readonly siguiente = computed(() => this.pending()[0])
  protected readonly cola = computed(() => this.pending().slice(1))
  protected readonly resueltos = computed(() => this.store.reports().filter((r) => r.status !== 'pendiente'))
  protected prioridad(r: Report) {
    return prioridadDe(r, this.store.reports()).nivel
  }
  protected cuantos(id: string) {
    return this.store.reports().filter((x) => x.reportedId === id).length
  }

  /** Atajos de la cola: D descarta, A advierte, S suspende el primero. */
  protected onKey(e: KeyboardEvent) {
    const t = e.target as HTMLElement
    if (t?.closest('input, textarea, select, [role="dialog"]') || e.ctrlKey || e.metaKey || e.altKey) return
    const r = this.siguiente()
    if (!r) return
    const k = e.key.toLowerCase()
    if (k === 'd') this.discard(r.id)
    else if (k === 'a') this.warn(r.id)
    else if (k === 's') this.suspend(r.id, personById(r.reportedId)?.name)
  }
  protected readonly counts = computed(() => {
    const r = this.store.reports()
    return [
      { label: 'Pendientes', value: r.filter((x) => x.status === 'pendiente').length, tone: 'text-ink' },
      { label: 'Advertidos', value: r.filter((x) => x.status === 'advertido').length, tone: 'text-ink-2' },
      { label: 'Suspendidos', value: r.filter((x) => x.status === 'suspendido').length, tone: 'text-danger' },
    ]
  })

  protected readonly pendingText = computed(() => {
    const n = this.pending().length
    return n === 0 ? 'No hay reportes pendientes.' : `${n} ${n === 1 ? 'reporte pendiente' : 'reportes pendientes'} de revisión.`
  })

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
