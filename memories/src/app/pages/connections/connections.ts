import { Component, computed, inject, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { AppStore } from '../../servicios/app-store'
import { personById } from '../../datos/mock'
import { matches } from '../../utilidades/text-search'
import { Avatar } from '../../componentes/avatar/avatar'
import { Banner } from '../../componentes/banner/banner'
import { Icon } from '../../componentes/icon/icon'
import { IntentBadge } from '../../componentes/intent-badge/intent-badge'

import { Pressure } from '../../directivas/pressure'

@Component({
  selector: 'app-connections',
  imports: [RouterLink, Avatar, Banner, Icon, IntentBadge, Pressure],
  styleUrl: './connections.css',
  templateUrl: './connections.html',
})
export class Connections {
  private readonly store = inject(AppStore)
  protected readonly query = signal('')

  protected readonly all = computed(() =>
    this.store.connections().flatMap((id) => {
      const person = personById(id)
      if (!person) return []
      const thread = this.store.messages()[id] ?? []
      const last = thread[thread.length - 1]
      return [{ person, thread, preview: last ? `${last.from === 'me' ? 'Tú: ' : ''}${last.text}` : 'Nueva conexión. Envía el primer mensaje.' }]
    }),
  )

  protected readonly rows = computed(() => {
    const q = this.query().trim()
    if (!q) return this.all()
    return this.all().flatMap((row) => {
      const message = row.thread.filter((m) => matches(m.text, q)).at(-1)
      if (message) return [{ ...row, preview: `${message.from === 'me' ? 'Tú: ' : ''}${message.text}` }]
      return matches(row.person.name, q) || row.person.interests.some((i) => matches(i, q)) ? [row] : []
    })
  })
}
