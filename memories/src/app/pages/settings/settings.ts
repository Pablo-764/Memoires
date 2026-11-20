import { Component, inject, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { AppStore } from '../../servicios/app-store'
import { ChoiceChip } from '../../componentes/choice-chip/choice-chip'
import { Icon } from '../../componentes/icon/icon'
import { Seal } from '../../componentes/seal/seal'
import { Modal } from '../../componentes/modal/modal'
import { ThemeService, type ThemeChoice } from '../../servicios/theme'


@Component({
  selector: 'app-settings',
  imports: [FormsModule, RouterLink, ChoiceChip, Icon, Modal, Seal],
  styleUrl: './settings.css',
  templateUrl: './settings.html',
})
export class Settings {
  protected readonly theme = inject(ThemeService)
  protected readonly themes: { value: ThemeChoice; label: string }[] = [
    { value: 'light', label: 'Claro' },
    { value: 'dark', label: 'Nocturno' },
    { value: 'system', label: 'Como el dispositivo' },
  ]
  protected readonly store = inject(AppStore)
  private readonly router = inject(Router)
  protected readonly limits = [30, 60, 90, 120]
  protected readonly confirmDelete = signal(false)
  protected readonly typed = signal('')

  protected logout() {
    this.store.logout()
    this.router.navigateByUrl('/')
  }

  protected deleteAccount() {
    this.store.deleteAccount()
    this.router.navigateByUrl('/')
  }
}
