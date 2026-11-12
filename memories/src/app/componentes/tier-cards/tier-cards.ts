import { Component, input, output } from '@angular/core'
import { FILTER_LABELS, TIERS, TIER_ORDER, formatLimit, mxn, type Tier } from '../../modelos/plans'
import { GRAND_STYLES, TOTAL_STYLES } from '../../modelos/decor'
import { Icon } from '../icon/icon'
import { Reveal } from '../../directivas/reveal'

function featureRows(t: Tier) {
  const info = TIERS[t]
  const hasDecor = info.decorations !== 'none'
  return [
    { ok: true, text: formatLimit(info.weeklyMatches, 'matches') + (Number.isFinite(info.weeklyMatches) ? ' por semana' : '') },
    { ok: true, text: Number.isFinite(info.weeklyWords) ? `${info.weeklyWords.toLocaleString('es-MX')} palabras de mensajes por semana` : 'Mensajes ilimitados' },
    { ok: true, text: `Filtros: ${info.filters.map((f) => FILTER_LABELS[f].toLowerCase()).join(', ')}` },
    {
      ok: hasDecor,
      text: info.decorations === 'all' ? `Los ${TOTAL_STYLES} estilos de perfil` : hasDecor ? `${GRAND_STYLES} de los ${TOTAL_STYLES} estilos de perfil` : 'Sin estilos de perfil de pago',
    },
    { ok: true, text: 'Foto, fondo propio y descripción' },
    { ok: true, text: 'Reportes, bloqueos y aviso de bienestar' },
  ]
}

@Component({
  selector: 'app-tier-cards',
  imports: [Icon, Reveal],
  styleUrl: './tier-cards.css',
  templateUrl: './tier-cards.html',
  host: { class: 'block' },
})
export class TierCards {
  readonly current = input<Tier>()
  readonly ctaLabel = input.required<(t: Tier) => string>()
  readonly choose = output<Tier>()

  protected readonly order = TIER_ORDER
  protected readonly tiers = TIERS
  protected readonly mxn = mxn
  protected readonly rows = featureRows
}
