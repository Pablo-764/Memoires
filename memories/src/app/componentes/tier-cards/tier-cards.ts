import { Component, input, output } from '@angular/core'
import { FILTER_LABELS, TIERS, TIER_ORDER, formatCount, mxn, type Tier } from '../../modelos/plans'
import { Icon } from '../icon/icon'

export interface Fila {
  label: string
  value: (t: Tier) => string | boolean
}

// Comparación completa (se muestra en tabla aparte, no en las tarjetas)
export const FILAS: Fila[] = [
  { label: '“Me interesa” por día', value: (t) => String(TIERS[t].likesPerDay) },
  { label: 'Hilos dorados por semana', value: (t) => String(TIERS[t].goldenPerWeek) },
  { label: 'Ver quién te dio “me interesa”', value: (t) => TIERS[t].seeWhoLiked },
  { label: 'Deshacer el último “ahora no”', value: (t) => TIERS[t].undo },
  { label: 'Filtros', value: (t) => TIERS[t].filters.map((f) => FILTER_LABELS[f].toLowerCase()).join(', ') },
  { label: 'Modo viaje “Voy a…”', value: (t) => (TIERS[t].travelPerMonth ? formatCount(TIERS[t].travelPerMonth, 'ciudades al mes') : false) },
  { label: 'Impulso de 30 minutos', value: (t) => (TIERS[t].boostsPerMonth ? `${TIERS[t].boostsPerMonth} al mes` : false) },
  { label: 'Estilos de perfil', value: (t) => ({ none: 'Básicos', some: 'Una parte', all: 'Todos' })[TIERS[t].decorations] },
  { label: 'Modo incógnito', value: (t) => TIERS[t].incognito },
  { label: 'Planes grupales que creas al mes', value: (t) => formatCount(TIERS[t].groupPlansPerMonth, 'planes') },
  { label: 'Conversar con tus conexiones', value: () => 'Sin límite' },
  { label: 'Seguridad completa', value: () => true },
]

// Lo que se destaca en cada objeto de la escala
const DESTACA: Record<Tier, string[]> = {
  free: ['20 “me interesa” al día', '1 hilo dorado a la semana', 'Conversación y seguridad completas'],
  grand: ['50 “me interesa” al día', 'Ver quién te dio “me interesa”', 'Un impulso medido al mes'],
  lucidite: ['100 “me interesa” al día', 'Todos los filtros e incógnito', 'Cuatro impulsos al mes'],
}

/**
 * Los tres planes como una escala (no tres columnas iguales): crecen de tamaño y el
 * recomendado, Grand, va elevado. La comparación completa va en una tabla aparte.
 */
@Component({
  selector: 'app-tier-cards',
  imports: [Icon],
  styleUrl: './tier-cards.css',
  templateUrl: './tier-cards.html',
  host: { class: 'block' },
})
export class TierCards {
  readonly current = input<Tier>()
  readonly ctaLabel = input.required<(t: Tier) => string>()
  readonly table = input(false)
  readonly choose = output<Tier>()

  protected readonly order = TIER_ORDER
  protected readonly tiers = TIERS
  protected readonly mxn = mxn
  protected readonly destaca = DESTACA
  protected readonly filas = FILAS
  protected readonly isBool = (v: string | boolean): v is boolean => typeof v === 'boolean'
}
