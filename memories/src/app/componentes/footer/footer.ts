import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Logo } from '../logo/logo'

@Component({
  selector: 'app-footer',
  imports: [RouterLink, Logo],
  styleUrl: './footer.css',
  templateUrl: './footer.html',
  host: { class: 'block' },
})
export class Footer {}
