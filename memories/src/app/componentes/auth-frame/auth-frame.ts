import { Component, input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Logo } from '../logo/logo'
import { ThemeIconButton } from '../theme-icon-button/theme-icon-button'
import { IntentConstellation } from '../intent-constellation/intent-constellation'
import { Seal, type SealKind } from '../seal/seal'

// Marco de inicio de sesión y registro: formulario a la izquierda; en escritorio,
// la constelación de intenciones y las promesas de seguridad a la derecha.
@Component({
  selector: 'app-auth-frame',
  imports: [RouterLink, Logo, ThemeIconButton, IntentConstellation, Seal],
  styleUrl: './auth-frame.css',
  templateUrl: './auth-frame.html',
})
export class AuthFrame {
  readonly title = input.required<string>()
  readonly subtitle = input.required<string>()

  protected readonly promises: { kind: SealKind; text: string }[] = [
    { kind: 'safe', text: 'Nadie te escribe sin que los dos quieran' },
    { kind: 'private', text: 'Tu ciudad sí, tu ubicación nunca' },
    { kind: 'report', text: 'Reportar y bloquear a un toque' },
  ]
}
