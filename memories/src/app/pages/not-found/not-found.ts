import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Logo } from '../../componentes/logo/logo'

// Página que no existe: la constelación con un hilo cortado y una estrella que se alejó
@Component({
  selector: 'app-not-found',
  imports: [RouterLink, Logo],
  styleUrl: './not-found.css',
  templateUrl: './not-found.html',
})
export class NotFound {
  protected readonly vecinos = [
    { x: 92, y: 110 },
    { x: 70, y: 214 },
    { x: 140, y: 262 },
    { x: 226, y: 236 },
    { x: 118, y: 52 },
  ]
}
