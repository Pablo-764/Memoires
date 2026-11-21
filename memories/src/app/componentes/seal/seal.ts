import { Component, computed, input } from '@angular/core'
import { Icon } from '../icon/icon'
import type { IconName } from '../icon/icons'

export type SealKind = 'verified' | 'id' | 'safe' | 'report' | 'block' | 'private'

const ICON: Record<SealKind, IconName> = {
  verified: 'badge-check',
  id: 'badge-check',
  safe: 'shield-check',
  report: 'flag',
  block: 'ban',
  private: 'lock',
}

// Sello de seguridad: un timbre de borde dentado en tinta neutra. Es el lenguaje
// visual de todo lo que protege (verificar, reportar, bloquear, privacidad) y a
// propósito no usa el color de ninguna intención.
@Component({
  selector: 'app-seal',
  imports: [Icon],
  styleUrl: './seal.css',
  template: `
    <span class="seal-stamp" aria-hidden="true">
      <svg viewBox="0 0 40 40" class="seal-edge">
        <path [attr.d]="edge" />
      </svg>
      <app-icon [name]="icon()" [size]="iconSize()" />
    </span>
    @if (label()) {
      <span class="seal-label">{{ label() }}</span>
    }
  `,
  host: { '[attr.data-kind]': 'kind()', '[attr.data-size]': 'size()' },
})
export class Seal {
  readonly kind = input<SealKind>('safe')
  readonly label = input('')
  readonly size = input<'sm' | 'md' | 'lg'>('sm')

  protected readonly icon = computed(() => ICON[this.kind()])
  protected readonly iconSize = computed(() => ({ sm: 13, md: 18, lg: 28 })[this.size()])

  // Borde de timbre: 16 puntas redondeadas alrededor de un círculo
  protected readonly edge = (() => {
    const n = 16
    const pts: string[] = []
    for (let i = 0; i < n * 2; i++) {
      const a = (Math.PI * i) / n - Math.PI / 2
      const r = i % 2 ? 17.2 : 19.4
      pts.push(`${(20 + r * Math.cos(a)).toFixed(2)} ${(20 + r * Math.sin(a)).toFixed(2)}`)
    }
    return `M${pts.join('L')}Z`
  })()
}
