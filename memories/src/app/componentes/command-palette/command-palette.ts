import { Component, ElementRef, afterNextRender, computed, inject, signal, viewChild } from '@angular/core'
import { Router } from '@angular/router'
import { AppStore } from '../../servicios/app-store'
import { ThemeService } from '../../servicios/theme'
import { Mando } from '../../servicios/mando'
import { PEOPLE, personById } from '../../datos/mock'
import { matches, highlight } from '../../utilidades/text-search'
import { Icon } from '../icon/icon'
import type { IconName } from '../icon/icons'

interface Comando {
  id: string
  grupo: 'Ir a' | 'Personas' | 'Conversaciones' | 'Intereses' | 'Planes' | 'Acciones'
  label: string
  hint?: string
  icon: IconName
  keywords?: string
  run: () => void
}

/**
 * Paleta de comandos (Ctrl+K): un buscador universal de destinos, personas,
 * conversaciones, intereses, planes y acciones como cambiar el tema. Combobox de
 * ARIA: las flechas mueven la selección, Enter ejecuta y Esc cierra.
 */
@Component({
  selector: 'app-command-palette',
  imports: [Icon],
  styleUrl: './command-palette.css',
  templateUrl: './command-palette.html',
})
export class CommandPalette {
  protected readonly mando = inject(Mando)
  private readonly store = inject(AppStore)
  private readonly theme = inject(ThemeService)
  private readonly router = inject(Router)
  private readonly input = viewChild<ElementRef<HTMLInputElement>>('q')

  protected readonly query = signal('')
  protected readonly active = signal(0)
  protected readonly parts = (t: string) => highlight(t, this.query())

  private go(url: string) {
    return () => this.router.navigateByUrl(url)
  }

  private readonly todos = computed<Comando[]>(() => {
    const s = this.store
    const destinos: Comando[] = [
      { id: 'd1', grupo: 'Ir a', label: 'Descubre', icon: 'orbit', run: this.go('/app/descubre') },
      { id: 'd2', grupo: 'Ir a', label: 'Conexiones', icon: 'message-circle', run: this.go('/app/conexiones') },
      { id: 'd3', grupo: 'Ir a', label: 'Planes', icon: 'calendar-days', run: this.go('/app/planes') },
      { id: 'd4', grupo: 'Ir a', label: 'Perfil', icon: 'user', run: this.go('/app/perfil') },
      { id: 'd5', grupo: 'Ir a', label: 'Plan y suscripción', icon: 'star', keywords: 'grand lucidite pagar', run: this.go('/app/suscripcion') },
      { id: 'd6', grupo: 'Ir a', label: 'Ajustes', icon: 'settings', keywords: 'bienestar cuenta', run: this.go('/app/ajustes') },
      { id: 'd7', grupo: 'Ir a', label: 'Aviso de privacidad', icon: 'lock', run: this.go('/privacidad') },
    ]
    const conversaciones: Comando[] = s.connections().flatMap((id) => {
      const p = personById(id)
      const last = s.messages()[id]?.at(-1)
      return p ? [{ id: 'c-' + id, grupo: 'Conversaciones' as const, label: p.name, hint: last?.text ?? 'Nueva conexión', icon: 'message-circle' as IconName, keywords: last?.text, run: this.go('/app/chat/' + id) }] : []
    })
    const personas: Comando[] = PEOPLE.filter((p) => !s.blocked().includes(p.id) && !s.connections().includes(p.id))
      .slice(0, 40)
      .map((p) => ({ id: 'p-' + p.id, grupo: 'Personas' as const, label: `${p.name}, ${p.age}`, hint: p.interests.slice(0, 3).join(', '), icon: 'user' as IconName, keywords: p.interests.join(' '), run: this.go('/app/persona/' + p.id) }))
    const intereses: Comando[] = s.me().interests.map((i) => ({ id: 'i-' + i, grupo: 'Intereses' as const, label: i, hint: 'Personas que también lo eligieron', icon: 'sparkles' as IconName, run: this.go('/app/descubre') }))
    const planes: Comando[] = s.plans().slice(0, 30).map((p) => ({ id: 'pl-' + p.id, grupo: 'Planes' as const, label: p.title, hint: `${p.when} · ${p.place}`, icon: 'calendar-days' as IconName, keywords: p.place, run: this.go('/app/planes') }))
    const acciones: Comando[] = [
      {
        id: 'a1',
        grupo: 'Acciones',
        label: this.theme.mode() === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo nocturno',
        icon: this.theme.mode() === 'dark' ? 'sun' : 'moon',
        keywords: 'tema oscuro claro noche',
        run: () => this.theme.set(this.theme.mode() === 'dark' ? 'light' : 'dark'),
      },
      { id: 'a2', grupo: 'Acciones', label: 'Crear un plan', icon: 'calendar-plus', run: this.go('/app/planes') },
      { id: 'a3', grupo: 'Acciones', label: 'Cerrar sesión', icon: 'log-out', run: () => (this.store.logout(), this.router.navigateByUrl('/')) },
    ]
    return [...destinos, ...conversaciones, ...personas, ...intereses, ...planes, ...acciones]
  })

  protected readonly results = computed(() => {
    const q = this.query().trim()
    if (q) return this.todos().filter((c) => matches(c.label, q) || (c.hint && matches(c.hint, q)) || (c.keywords && matches(c.keywords, q))).slice(0, 12)
    // Sin texto: los destinos y las acciones siempre, y las conversaciones recientes
    const by = (g: Comando['grupo']) => this.todos().filter((c) => c.grupo === g)
    return [...by('Ir a').slice(0, 4), ...by('Acciones'), ...by('Conversaciones').slice(0, 4)]
  })

  protected readonly groups = computed(() => {
    const out: { grupo: string; items: (Comando & { index: number })[] }[] = []
    this.results().forEach((c, index) => {
      const g = out.find((x) => x.grupo === c.grupo)
      if (g) g.items.push({ ...c, index })
      else out.push({ grupo: c.grupo, items: [{ ...c, index }] })
    })
    return out
  })

  constructor() {
    afterNextRender(() => this.input()?.nativeElement.focus())
  }

  protected onInput(v: string) {
    this.query.set(v)
    this.active.set(0)
  }

  protected onKey(e: KeyboardEvent) {
    const n = this.results().length
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (n) this.active.update((i) => (i + 1) % n)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (n) this.active.update((i) => (i - 1 + n) % n)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const c = this.results()[this.active()]
      if (c) this.exec(c)
    } else if (e.key === 'Escape') {
      this.mando.cerrarPaleta()
    }
  }

  protected exec(c: Comando) {
    this.mando.cerrarPaleta()
    c.run()
  }
}
