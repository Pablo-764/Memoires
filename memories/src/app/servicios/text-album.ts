import { Injectable, signal } from '@angular/core'

const KEY = 'memoires-text-album'

function read() {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

/**
 * Modo "álbum de texto": fondos, marcos y efectos de perfil se dibujan con caracteres.
 * Nunca toca las fotos de las personas. Se recuerda en este navegador.
 */
@Injectable({ providedIn: 'root' })
export class TextAlbum {
  readonly on = signal(read())

  set(next: boolean) {
    this.on.set(next)
    try {
      if (next) localStorage.setItem(KEY, '1')
      else localStorage.removeItem(KEY)
    } catch {
      /* almacenamiento no disponible: dura solo esta visita */
    }
  }
}
