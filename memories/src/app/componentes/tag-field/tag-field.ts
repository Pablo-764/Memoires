import { Component, computed, input, output, signal } from '@angular/core'
import { matches } from '../../utilidades/text-search'
import { Icon } from '../icon/icon'

let uid = 0

/**
 * Campo de etiquetas con búsqueda: las elegidas son etiquetas que se quitan con un
 * toque; al escribir aparecen sugerencias (y, si se permite, la opción de agregar lo
 * escrito). Con max = 1 funciona como una sola elección.
 */
@Component({
  selector: 'app-tag-field',
  imports: [Icon],
  styleUrl: './tag-field.css',
  templateUrl: './tag-field.html',
  host: { class: 'block' },
})
export class TagField {
  readonly label = input.required<string>()
  readonly values = input.required<string[]>()
  readonly options = input<string[]>([])
  readonly max = input(Infinity)
  readonly allowCustom = input(false)
  readonly placeholder = input('Buscar…')
  readonly changed = output<string[]>()

  protected readonly id = `tag-${++uid}`
  protected readonly query = signal('')
  protected readonly open = signal(false)
  protected readonly active = signal(0)

  protected readonly suggestions = computed(() => {
    const q = this.query().trim()
    const free = this.options().filter((o) => !this.values().includes(o))
    const list = q ? free.filter((o) => matches(o, q)) : free
    const custom = this.allowCustom() && q && !this.options().some((o) => o.toLowerCase() === q.toLowerCase()) && !this.values().includes(q) ? [q] : []
    return [...list.slice(0, 6), ...custom]
  })

  protected add(v: string) {
    const next = this.max() === 1 ? [v] : [...this.values(), v].slice(0, this.max())
    this.changed.emit(next)
    this.query.set('')
    this.active.set(0)
  }

  protected remove(v: string) {
    this.changed.emit(this.values().filter((x) => x !== v))
  }

  protected onKey(e: KeyboardEvent) {
    const n = this.suggestions().length
    if (e.key === 'ArrowDown' && n) {
      e.preventDefault()
      this.open.set(true)
      this.active.update((i) => (i + 1) % n)
    } else if (e.key === 'ArrowUp' && n) {
      e.preventDefault()
      this.active.update((i) => (i - 1 + n) % n)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const s = this.suggestions()[this.active()]
      if (s) this.add(s)
    } else if (e.key === 'Backspace' && !this.query() && this.values().length) {
      this.remove(this.values().at(-1)!)
    } else if (e.key === 'Escape') {
      this.open.set(false)
    }
  }
}
