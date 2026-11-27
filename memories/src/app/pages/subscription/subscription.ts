import { Component, OnInit, computed, inject, signal } from '@angular/core'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { AppStore } from '../../servicios/app-store'
import { ApiError, BackendApi, type BillingConfig } from '../../servicios/api'
import { Celebrate } from '../../servicios/celebrate'
import { GARANTIAS, SIEMPRE_GRATIS, TIERS, mxn, type Tier } from '../../modelos/plans'
import { QueCompras } from '../../componentes/que-compras/que-compras'
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
export class Subscription implements OnInit {
  protected readonly store = inject(AppStore)
  private readonly celebrate = inject(Celebrate)
  private readonly api = inject(BackendApi)
  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)
  protected readonly tiers = TIERS
  protected readonly mxn = mxn
  protected readonly info = computed(() => TIERS[this.store.tier()])
  protected readonly checkout = signal<Tier | null>(null)
  protected readonly paying = signal<'paypal' | 'stripe' | null>(null)
  protected readonly billingConfig = signal<BillingConfig | null>(null)
  protected readonly paymentError = signal('')
  protected readonly currentSubscription = signal<{ provider: string; expires_at: string } | null>(null)
  protected readonly showLuc = signal(false)
  protected readonly lucTheme = THEMES.find((t) => t.key === 'col-celestial')!
  protected readonly luc = this.lucTheme
  protected readonly lucName = nameStyleOf(this.lucTheme.name)
  protected readonly totalStyles = TOTAL_STYLES
  protected readonly myName = computed(() => this.store.me().name || 'Tu')
  protected readonly cta = (t: Tier) => (t === 'free' ? 'Volver a Gratuito' : `Cambiar a ${TIERS[t].name}`)
  protected readonly garantias = GARANTIAS
  protected readonly gratis = SIEMPRE_GRATIS

  ngOnInit() {
    void this.loadBilling()
    void this.finishCheckoutReturn()
  }

  private async loadBilling() {
    try {
      this.billingConfig.set(await this.api.request<BillingConfig>('/billing/config'))
      if (!this.api.token) return
      const current = await this.api.request<{ tier: Tier; subscription: { provider: string; expires_at: string } | null }>('/billing/current')
      this.store.setTier(current.tier)
      this.currentSubscription.set(current.subscription)
    } catch (error) {
      this.paymentError.set(error instanceof ApiError ? error.message : 'No se pudo consultar la configuracion de pagos.')
    }
  }

  private async finishCheckoutReturn() {
    const params = this.route.snapshot.queryParamMap
    const paypalOrder = params.get('token')
    const stripeSession = params.get('stripe_session')
    if (params.has('paypal_cancel') || params.has('stripe_cancel')) {
      this.paymentError.set('El pago se cancelo y no se hizo ningun cargo.')
      this.clearPaymentParams()
      return
    }
    if (!paypalOrder && !stripeSession) return
    if (!this.api.token) {
      this.paymentError.set('Inicia sesion en esta pestana para confirmar tu pago.')
      return
    }
    this.paying.set(paypalOrder ? 'paypal' : 'stripe')
    this.paymentError.set('')
    let confirmed = false
    try {
      if (paypalOrder) {
        const result = await this.api.post<{ status: string; tier?: Tier }>(`/billing/paypal/orders/${encodeURIComponent(paypalOrder)}/capture`, {})
        if (result.status === 'COMPLETED' && result.tier && result.tier !== 'free') {
          confirmed = true
          this.store.setTier(result.tier)
          this.store.toast(`Pago confirmado. Ya tienes ${TIERS[result.tier].name}.`, 'ok')
          this.celebrate.play(result.tier, { giant: true })
        } else this.paymentError.set('PayPal aun no confirma el pago. Revisa el estado de la orden.')
      } else if (stripeSession) {
        const result = await this.api.request<{ status: string; tier?: Tier }>(`/billing/stripe/checkout/${encodeURIComponent(stripeSession)}`)
        if (result.status === 'COMPLETED' && result.tier && result.tier !== 'free') {
          confirmed = true
          this.store.setTier(result.tier)
          this.store.toast(`Pago confirmado. Ya tienes ${TIERS[result.tier].name}.`, 'ok')
          this.celebrate.play(result.tier, { giant: true })
        } else this.paymentError.set('Stripe aun esta procesando el pago. Recarga esta pagina en unos segundos.')
      }
      if (confirmed) {
        await this.loadBilling()
        this.clearPaymentParams()
      }
    } catch (error) {
      this.paymentError.set(error instanceof ApiError ? error.message : 'No se pudo confirmar el pago. Revisa el estado antes de intentar pagar otra vez.')
    } finally {
      this.paying.set(null)
    }
  }

  private clearPaymentParams() {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { token: null, PayerID: null, stripe_session: null, paypal_cancel: null, stripe_cancel: null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    })
  }

  protected async cancelar() {
    try {
      const result = await this.api.post<{ url: string }>('/billing/stripe/portal', {})
      window.location.assign(result.url)
    } catch (error) {
      this.paymentError.set(error instanceof ApiError ? error.message : 'No se pudo abrir el portal de Stripe.')
    }
  }

  protected choose(t: Tier) {
    if (t === 'free') return
    this.paymentError.set('')
    this.checkout.set(t)
  }

  protected closeCheckout() {
    if (!this.paying()) this.checkout.set(null)
  }

  protected async pay(method: 'paypal' | 'stripe', tier: Tier) {
    this.paymentError.set('')
    if (!this.api.token) {
      this.paymentError.set('Crea una cuenta o inicia sesion real para pagar. La cuenta de demostracion no admite cargos.')
      return
    }
    const config = this.billingConfig()
    if (config && method === 'paypal' && !config.enabled) {
      this.paymentError.set('PayPal no esta configurado en el backend.')
      return
    }
    if (config && method === 'stripe' && (!config.stripe.enabled || !config.stripe.configured)) {
      this.paymentError.set('Stripe no esta configurado con una clave y los Price IDs de ambos planes.')
      return
    }
    this.paying.set(method)
    try {
      if (method === 'paypal') {
        const order = await this.api.post<{ approveUrl: string | null }>('/billing/paypal/orders', { tier }, crypto.randomUUID())
        if (!order.approveUrl) throw new Error('PayPal no devolvio el enlace para aprobar el pago.')
        window.location.assign(order.approveUrl)
      } else {
        const checkout = await this.api.post<{ url: string }>('/billing/stripe/checkout', { tier }, crypto.randomUUID())
        window.location.assign(checkout.url)
      }
    } catch (error) {
      this.paying.set(null)
      this.paymentError.set(error instanceof ApiError ? error.message : error instanceof Error ? error.message : 'No se pudo iniciar el pago.')
    }
  }
}
