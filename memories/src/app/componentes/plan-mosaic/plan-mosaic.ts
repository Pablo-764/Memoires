import { Component, computed, input } from '@angular/core'

export interface MosaicItem {
  id: string
  photo?: string
  note: string
  tone: string
  date?: string
  people?: string[]
}

// Azar con semilla por plan: el mosaico sale igual cada vez (idea del empacado de LinNeo,
// implementado aquí con la cuadrícula densa de CSS)
function seed(text: string) {
  let h = 2166136261
  for (const c of text) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  return (h >>> 0) / 4294967296
}

const SHAPES = [
  { c: 2, r: 2 },
  { c: 1, r: 1 },
  { c: 1, r: 2 },
  { c: 2, r: 1 },
  { c: 1, r: 1 },
]

/**
 * Álbum de planes cumplidos en mosaico. Momento firma de Planes: las piezas caen
 * giradas como fotos sobre una mesa y se acomodan en la retícula.
 */
@Component({
  selector: 'app-plan-mosaic',
  styleUrl: './plan-mosaic.css',
  templateUrl: './plan-mosaic.html',
  host: { class: 'block' },
})
export class PlanMosaic {
  readonly items = input.required<MosaicItem[]>()

  protected readonly tiles = computed(() =>
    this.items().map((it, i) => {
      const s = seed(it.id)
      const shape = i === 0 ? SHAPES[0] : SHAPES[Math.floor(s * SHAPES.length)]
      return { ...it, cols: shape.c, rows: shape.r, tilt: ((s * 2 - 1) * 9).toFixed(1), order: i }
    }),
  )

  protected format(date?: string) {
    if (!date) return ''
    const d = new Date(date.replace(' ', 'T'))
    return isNaN(d.getTime()) ? date : d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
  }
}
