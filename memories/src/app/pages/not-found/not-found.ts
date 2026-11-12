import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { AsciiArt } from '../../componentes/ascii-art/ascii-art'
import { Logo } from '../../componentes/logo/logo'

// Página que no existe: una flor marchita que se endereza al pasar el cursor
@Component({
  selector: 'app-not-found',
  imports: [RouterLink, AsciiArt, Logo],
  templateUrl: './not-found.html',
})
export class NotFound {}
