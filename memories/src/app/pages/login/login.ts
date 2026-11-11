import { Component, inject, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { AppStore } from '../../servicios/app-store'
import { AuthFrame } from '../../componentes/auth-frame/auth-frame'

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, AuthFrame],
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private readonly store = inject(AppStore)
  private readonly router = inject(Router)

  protected readonly email = signal('ana@correo.mx')
  protected readonly password = signal('demo1234')
  protected readonly error = signal('')

  protected submit() {
    if (!/^\S+@\S+\.\S+$/.test(this.email())) return this.error.set('Escribe un correo válido, por ejemplo nombre@correo.mx.')
    if (this.password().length < 8) return this.error.set('La contraseña debe tener al menos 8 caracteres.')
    this.store.login(this.email())
    this.router.navigateByUrl('/app/descubre')
  }
}
