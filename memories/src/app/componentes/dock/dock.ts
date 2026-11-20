import { Component, inject, input } from '@angular/core'
import { Router, RouterLink } from '@angular/router'
import { Mando } from '../../servicios/mando'
import type { NavItem } from '../../modelos/navegacion'
import { Icon } from '../icon/icon'

/**
 * Dock inferior (celular): dos destinos a cada lado y al centro el botón elevado
 * "Conectar", del color de la intención. Dispara la acción principal de la pantalla
 * o, si no hay, lleva a Descubre.
 */
@Component({
  selector: 'app-dock',
  imports: [RouterLink, Icon],
  styleUrl: './dock.css',
  templateUrl: './dock.html',
})
export class Dock {
  readonly items = input.required<NavItem[]>()
  readonly active = input.required<number>()

  protected readonly mando = inject(Mando)
  private readonly router = inject(Router)

  protected conectar() {
    const a = this.mando.accion()
    if (a) a.run()
    else this.router.navigateByUrl('/app/descubre')
  }
}
