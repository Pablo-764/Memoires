import { Component, inject } from '@angular/core'
import { Location } from '@angular/common'
import { Router, RouterLink } from '@angular/router'
import { AppStore } from '../../servicios/app-store'
import { Seal } from '../../componentes/seal/seal'
import { Logo } from '../../componentes/logo/logo'

@Component({
  selector: 'app-privacy',
  imports: [RouterLink, Logo, Seal],
  styleUrl: './privacy.css',
  templateUrl: './privacy.html',
})
export class Privacy {
  protected readonly store = inject(AppStore)
  private readonly location = inject(Location)
  private readonly router = inject(Router)

  protected back() {
    if (this.router.lastSuccessfulNavigation()?.previousNavigation) this.location.back()
    else this.router.navigateByUrl(this.store.homeUrl())
  }
}
