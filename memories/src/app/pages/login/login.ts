import { Component, inject, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { AppStore } from '../../servicios/app-store'
import { ApiError, BackendApi, type ApiSession } from '../../servicios/api'
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
  private readonly api = inject(BackendApi)

  protected readonly email = signal('')
  protected readonly password = signal('')
  protected readonly error = signal('')

  protected async submit() {
    const contact = this.email().trim()
    if (!/^\S+@\S+\.\S+$/.test(contact) && !/^\+?\d{10,13}$/.test(contact.replace(/[\s-]/g, ''))) return this.error.set('Escribe un correo válido o un teléfono de 10 a 13 dígitos.')
    if (this.password().length < 8) return this.error.set('La contraseña debe tener al menos 8 caracteres.')
    this.error.set('')
    try {
      const session = await this.api.post<ApiSession>('/auth/login', { contact, password: this.password() })
      this.api.setToken(session.token)
      this.store.login(session.usuario.email || session.usuario.phone || contact, session.perfil, session.usuario.tier)
      await this.router.navigateByUrl('/app/descubre')
    } catch (error) {
      this.error.set(error instanceof ApiError ? error.message : 'No se pudo iniciar sesion.')
    }
  }
}
