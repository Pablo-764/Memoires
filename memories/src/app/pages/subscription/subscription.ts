import { Component, computed, inject, signal } from '@angular/core'
import { AppStore } from '../../servicios/app-store'
import { Celebrate } from '../../servicios/celebrate'
import { GARANTIAS, SIEMPRE_GRATIS, TIERS, mxn, type Tier } from '../../modelos/plans'
import { QueCompras } from '../../componentes/que-compras/que-compras'
import { RouterLink } from '@angular/router'
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
  imports: [Avatar, Banner, Effect, Icon, Meter, Modal, TierCards, QueCompras, RouterLink],
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

  protected readonly cta = (t: Tier) => (t === 'free' ? 'Volver a Gratuito' : `Cambiar a ${TIERS[t].name}`)
  protected readonly garantias = GARANTIAS
  protected readonly gratis = SIEMPRE_GRATIS
  // Cancelar en dos toques: el primero pregunta en el lugar, el segundo cancela
  protected readonly cancelando = signal(false)

  protected cancelar() {
    this.store.setTier('free')
    this.cancelando.set(false)
    this.store.toast('Suscripción cancelada. Conservas lo pagado hasta el fin del periodo.', 'ok')
  }

  protected reembolso() {
    this.store.setTier('free')
    this.store.toast('Reembolso solicitado: te devolvemos todo en 5 días hábiles.', 'ok')
  }

  protected choose(t: Tier) {
    if (t === 'free') this.cancelando.set(true)
    else this.checkout.set(t)
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
