import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Logo } from '../../componentes/logo/logo'

/** Estrellas sobre el contorno de la luna (posiciones fijas para que la escena salga igual). */
const LUNA = [
  { x: 236, y: 58, r: 5 },
  { x: 168, y: 96, r: 3.5 },
  { x: 138, y: 150, r: 4 },
  { x: 150, y: 212, r: 3.5 },
  { x: 200, y: 250, r: 4 },
  { x: 262, y: 258, r: 5 },
  { x: 192, y: 120, r: 2.5 },
  { x: 190, y: 176, r: 2.5 },
  { x: 222, y: 226, r: 2.5 },
]

const POLVO = [
  [60, 60], [96, 250], [320, 140], [350, 230], [44, 170], [300, 290], [120, 30], [370, 60], [80, 120], [340, 300],
]

@Component({
  selector: 'app-rest',
  imports: [RouterLink, Logo],
  styleUrl: './rest.css',
  templateUrl: './rest.html',
})
export class Rest {
  protected readonly estrellasLuna = LUNA.map((s, i) => ({ ...s, d: (i * 0.53) % 4.8 }))
  protected readonly polvo = POLVO.map(([x, y], i) => ({ x, y, d: (i * 0.71) % 6 }))
}
