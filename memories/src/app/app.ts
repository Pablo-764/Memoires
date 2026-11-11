import { Component, inject } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { ThemeService } from './servicios/theme'
import { Toaster } from './componentes/toaster/toaster'
import { Backdrop } from './componentes/backdrop/backdrop'
import { HoverFx } from './servicios/hover-fx'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toaster, Backdrop],
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  // Se instancia aquí para que el tema siga al sistema desde el arranque
  private readonly theme = inject(ThemeService)
  // Brillo en tarjetas y botones que siguen al cursor
  private readonly hover = inject(HoverFx)
}
