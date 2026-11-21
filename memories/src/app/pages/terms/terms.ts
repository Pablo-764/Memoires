import { Location } from '@angular/common'
import { Component, inject } from '@angular/core'
import { RouterLink } from '@angular/router'
import { GARANTIAS, SIEMPRE_GRATIS, TIERS, mxn } from '../../modelos/plans'
import { Logo } from '../../componentes/logo/logo'
import { Seal } from '../../componentes/seal/seal'

// Términos de la suscripción en lenguaje claro (demostración académica, sin cobros reales)
@Component({
  selector: 'app-terms',
  imports: [RouterLink, Logo, Seal],
  templateUrl: './terms.html',
})
export class Terms {
  private readonly location = inject(Location)
  protected readonly garantias = GARANTIAS
  protected readonly gratis = SIEMPRE_GRATIS
  protected readonly grand = mxn.format(TIERS.grand.priceMxn)
  protected readonly lucidite = mxn.format(TIERS.lucidite.priceMxn)

  protected back() {
    this.location.back()
  }
}
