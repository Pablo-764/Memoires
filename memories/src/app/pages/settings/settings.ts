import { Component, inject, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { AppStore } from '../../servicios/app-store'
import { ChoiceChip } from '../../componentes/choice-chip/choice-chip'
import { Icon } from '../../componentes/icon/icon'
import { Modal } from '../../componentes/modal/modal'
import { ThemeSegmented } from '../../componentes/theme-segmented/theme-segmented'
import { TextAlbum } from '../../servicios/text-album'
import { ThemeService } from '../../servicios/theme'


@Component({
  selector: 'app-settings',
  imports: [FormsModule, RouterLink, ChoiceChip, Icon, Modal, ThemeSegmented],
  styleUrl: './settings.css',
  templateUrl: './settings.html',
})
export class Settings {
  protected readonly textAlbum = inject(TextAlbum)

  constructor() {
    // Las siluetas de la mancha de tinta quedan listas antes de tocar el selector de tema
    inject(ThemeService).prepare()
  }
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
