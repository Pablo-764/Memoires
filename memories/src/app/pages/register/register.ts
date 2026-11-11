import { Component, inject, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { AppStore } from '../../servicios/app-store'
import { AuthFrame } from '../../componentes/auth-frame/auth-frame'
import { Field } from '../../componentes/field/field'

function ageFrom(date: string) {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return 0
  const now = new Date()
  let age = now.getFullYear() - d.getFullYear()
  if (now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())) age--
  return age
}

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink, AuthFrame, Field],
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  private readonly store = inject(AppStore)
  private readonly router = inject(Router)

  protected readonly name = signal('')
  protected readonly email = signal('')
  protected readonly password = signal('')
  protected readonly birth = signal('')
  protected readonly privacy = signal(false)
  protected readonly sensitive = signal(false)
  protected readonly errors = signal<Record<string, string>>({})

  protected submit() {
    const next: Record<string, string> = {}
    if (this.name().trim().length < 2) next['name'] = 'Escribe tu nombre.'
    if (!/^\S+@\S+\.\S+$/.test(this.email())) next['email'] = 'Escribe un correo válido.'
    if (this.password().length < 8) next['password'] = 'Usa al menos 8 caracteres.'
    const age = ageFrom(this.birth())
    if (!this.birth()) next['birth'] = 'Indica tu fecha de nacimiento.'
    else if (age < 18) next['birth'] = 'mémoires es solo para mayores de 18 años.'
    if (!this.privacy()) next['privacy'] = 'Necesitas aceptar el aviso de privacidad para continuar.'
    this.errors.set(next)
    if (Object.keys(next).length) return
    this.store.register({ name: this.name().trim(), email: this.email(), age })
    this.router.navigateByUrl('/bienvenida')
  }
}
