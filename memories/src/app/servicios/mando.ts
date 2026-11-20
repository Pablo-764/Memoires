import { Injectable, signal } from '@angular/core'

export interface AccionPrincipal {
  label: string
  run: () => void
}

/**
 * Estado compartido de la estructura global: la paleta de comandos (Ctrl+K) y la
 * acción principal de la pantalla, que dispara el botón central del dock en celular.
 * Si la página no declara ninguna, el botón lleva a Descubre.
 */
@Injectable({ providedIn: 'root' })
export class Mando {
  readonly paletaAbierta = signal(false)
  readonly accion = signal<AccionPrincipal | null>(null)

  abrirPaleta() {
    this.paletaAbierta.set(true)
  }

  cerrarPaleta() {
    this.paletaAbierta.set(false)
  }

  /** Declara la acción principal mientras la página vive; devuelve cómo quitarla. */
  declarar(accion: AccionPrincipal) {
    this.accion.set(accion)
    return () => {
      if (this.accion() === accion) this.accion.set(null)
    }
  }
}
