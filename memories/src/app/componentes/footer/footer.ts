import { Component, input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Logo } from '../logo/logo'
import { ProfileQr } from '../profile-qr/profile-qr'

@Component({
  selector: 'app-footer',
  imports: [RouterLink, Logo, ProfileQr],
  styleUrl: './footer.css',
  templateUrl: './footer.html',
  host: { class: 'block' },
})
export class Footer {
  /** Si llega, el pie muestra el QR de mémoires (dis-094, dis-081). */
  readonly qr = input<string>()
}
