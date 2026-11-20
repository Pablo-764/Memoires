import { Component, computed, input } from '@angular/core'
import qrcode from 'qrcode-generator'

interface Dot {
  x: number
  y: number
}

/**
 * QR del perfil (dis-094 y dis-081): los módulos de datos son puntos, como una
 * constelación; los tres ojos se quedan cuadrados para que los lectores los
 * encuentren, y el centro lleva el punto de la É en la tinta activa. Usa
 * corrección de errores alta (H), así el punto central no impide leerlo.
 */
@Component({
  selector: 'app-profile-qr',
  styleUrl: './profile-qr.css',
  templateUrl: './profile-qr.html',
  host: { class: 'block' },
})
export class ProfileQr {
  readonly url = input.required<string>()
  readonly label = input('Código QR de tu perfil')

  private readonly matrix = computed(() => {
    const qr = qrcode(0, 'H')
    qr.addData(this.url())
    qr.make()
    const n = qr.getModuleCount()
    return { n, dark: (r: number, c: number) => qr.isDark(r, c) }
  })

  protected readonly size = computed(() => this.matrix().n)
  protected readonly view = computed(() => `-2 -2 ${this.size() + 4} ${this.size() + 4}`)

  // Los tres ojos: esquina superior izquierda, superior derecha e inferior izquierda
  protected readonly eyes = computed(() => {
    const n = this.size()
    return [
      { x: 0, y: 0 },
      { x: n - 7, y: 0 },
      { x: 0, y: n - 7 },
    ]
  })

  protected readonly dots = computed<Dot[]>(() => {
    const { n, dark } = this.matrix()
    const inEye = (r: number, c: number) => (r < 8 && c < 8) || (r < 8 && c >= n - 8) || (r >= n - 8 && c < 8)
    const mid = n / 2
    const hole = n * 0.11
    const out: Dot[] = []
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (!dark(r, c) || inEye(r, c)) continue
        if (Math.abs(r + 0.5 - mid) < hole && Math.abs(c + 0.5 - mid) < hole) continue
        out.push({ x: c + 0.5, y: r + 0.5 })
      }
    }
    return out
  })

  protected readonly center = computed(() => this.size() / 2)
}
