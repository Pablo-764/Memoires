import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Logo } from '../../componentes/logo/logo'

// Página que no existe: una flor marchita que se endereza al pasar el cursor
@Component({
  selector: 'app-not-found',
  imports: [RouterLink, Logo],
  templateUrl: './not-found.html',
})
export class NotFound {}
