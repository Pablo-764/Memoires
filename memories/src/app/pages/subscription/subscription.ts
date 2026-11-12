import { Component, computed, inject, signal } from '@angular/core'
import { AppStore } from '../../servicios/app-store'
import { Celebrate } from '../../servicios/celebrate'
import { TIERS, mxn, type Tier } from '../../modelos/plans'
import { Icon } from '../../componentes/icon/icon'
import { Meter } from '../../componentes/meter/meter'
import { Modal } from '../../componentes/modal/modal'
import { TierCards } from '../../componentes/tier-cards/tier-cards'
import { Avatar } from '../../componentes/avatar/avatar'
import { Banner } from '../../componentes/banner/banner'
import { Effect } from '../../componentes/effect/effect'
import { THEMES, TOTAL_STYLES, nameStyleOf } from '../../modelos/decor'

@Component({
  selector: 'app-subscription',
  imports: [Avatar, Banner, Effect, Icon, Meter, Modal, TierCards],
  styleUrl: './subscription.css',
  templateUrl: './subscription.html',
})
export class Subscription {
  protected readonly store = inject(AppStore)
  private readonly celebrate = inject(Celebrate)
  protected readonly tiers = TIERS
  protected readonly mxn = mxn
  protected readonly info = computed(() => TIERS[this.store.tier()])
  protected readonly checkout = signal<Tier | null>(null)
  protected readonly paying = signal<'paypal' | 'gpay' | null>(null)

  // Vista previa de Lucidité con un tema mítico sobre el perfil propio
  protected readonly showLuc = signal(false)
  protected readonly lucTheme = THEMES.find((t) => t.key === 'col-celestial')!
  protected readonly luc = this.lucTheme
  protected readonly lucName = nameStyleOf(this.lucTheme.name)
  protected readonly totalStyles = TOTAL_STYLES
  protected readonly myName = computed(() => this.store.me().name || 'Tú')

  protected readonly cta = (t: Tier) => (t === 'free' ? 'Cancelar suscripción' : `Cambiar a ${TIERS[t].name}`)

  protected choose(t: Tier) {
    if (t === 'free') {
      this.store.setTier('free')
      this.store.toast('Cancelaste tu suscripción. Vuelves al plan Gratuito.')
    } else this.checkout.set(t)
  }

  protected closeCheckout() {
    if (!this.paying()) this.checkout.set(null)
  }

  protected pay(method: 'paypal' | 'gpay', tier: Tier) {
    this.paying.set(method)
    window.setTimeout(() => {
      this.store.setTier(tier)
      this.paying.set(null)
      this.checkout.set(null)
      this.store.toast(`Ahora tienes ${TIERS[tier].name}`, 'ok')
      if (tier !== 'free') this.celebrate.play(tier, { giant: true })
    }, 1100)
  }
}
