import { Component, inject } from '@angular/core'
import { AppStore } from '../../servicios/app-store'

@Component({
  selector: 'app-toaster',
  styleUrl: './toaster.css',
  templateUrl: './toaster.html',
})
export class Toaster {
  protected readonly store = inject(AppStore)
}
