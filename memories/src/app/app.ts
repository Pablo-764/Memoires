import { Component, inject } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { ThemeService } from './servicios/theme'
import { Toaster } from './componentes/toaster/toaster'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toaster],
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  // Se instancia aquí para que el tema siga al sistema desde el arranque
  private readonly theme = inject(ThemeService)
}
