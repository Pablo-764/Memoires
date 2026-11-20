import { Component, effect, inject } from '@angular/core'
import { AppStore } from '../../servicios/app-store'

// Fondo de toda la app: el asanoha de iroFactory casi invisible y dos luces
// (la tinta activa y la marca) que derivan muy despacio. También decide la
// intención activa de <html>: la que pida la página o la preferida del usuario.
@Component({
  selector: 'app-backdrop',
  styleUrl: './backdrop.css',
  template: `<div class="asanoha"></div>
    <div class="light light-a"></div>
    <div class="light light-b"></div>`,
  host: { 'aria-hidden': 'true' },
})
export class Backdrop {
  private readonly store = inject(AppStore)

  constructor() {
    effect(() => {
      const root = document.documentElement
      const tone = this.store.backdropTone() ?? (this.store.loggedIn() && this.store.onboarded() ? this.store.preferredIntent() : null)
      if (tone) root.dataset['intent'] = tone
      else delete root.dataset['intent']
    })
  }
}
