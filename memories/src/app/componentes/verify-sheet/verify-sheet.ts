import { Component, inject, output, signal } from '@angular/core'
import { AppStore } from '../../servicios/app-store'
import { Modal } from '../modal/modal'
import { Seal } from '../seal/seal'

const POSES = [
  'Toca tu oreja izquierda con la mano derecha',
  'Levanta el pulgar junto a tu cara',
  'Haz el número tres con la mano izquierda',
  'Pon la mano abierta junto a tu mejilla',
  'Señala hacia arriba con el índice',
]

/**
 * Verificación con selfie de pose aleatoria (en la demo, simulada). Es obligatoria
 * para conectar y siempre gratis: nadie habla con perfiles falsos.
 */
@Component({
  selector: 'app-verify-sheet',
  imports: [Modal, Seal],
  template: `
    <app-modal title="Verifícate para conectar" (closed)="closed.emit()">
      @switch (paso()) {
        @case ('pose') {
          <p class="text-ink-2">Pedimos una selfie con una pose al azar para confirmar que eres tú. Así nadie habla con perfiles falsos. Es gratis siempre.</p>
          <div class="pose">
            <span class="font-mono text-xs uppercase tracking-wider text-ink-2">Tu pose</span>
            <p class="mt-1 text-xl font-extrabold">{{ pose }}</p>
          </div>
          <p class="text-sm text-ink-2">Demostración: no se usa la cámara; el siguiente paso simula la revisión.</p>
          <button class="btn btn-primary mt-6 w-full" (click)="tomar()">Tomar selfie</button>
        }
        @case ('revisando') {
          <div class="flex flex-col items-center py-6 text-center" role="status">
            <span class="spinner" aria-hidden="true"></span>
            <p class="mt-4 font-semibold">Revisando tu pose…</p>
          </div>
        }
        @default {
          <div class="flex flex-col items-center py-4 text-center" role="status">
            <app-seal kind="verified" size="lg" />
            <p class="mt-4 text-xl font-extrabold">Perfil verificado</p>
            <p class="mt-1 text-ink-2">Tu sello azul ya se ve en tu perfil. Ya puedes conectar.</p>
            <button class="btn btn-primary mt-6 w-full" (click)="closed.emit()">Listo</button>
          </div>
        }
      }
    </app-modal>
  `,
  styles: `
    .pose { margin: 1.25rem 0 0.75rem; padding: 1rem 1.125rem; border-radius: var(--radius-card); background: var(--wash); }
    .spinner { width: 2.5rem; height: 2.5rem; border-radius: 50%; border: 3px solid var(--color-line); border-top-color: var(--tint); animation: spin 800ms linear infinite; }
    @keyframes spin { to { transform: rotate(1turn); } }
    @media (prefers-reduced-motion: reduce) { .spinner { animation-duration: 3s; } }
    :host app-seal { color: var(--plan-ink); }
  `,
})
export class VerifySheet {
  readonly closed = output<void>()
  private readonly store = inject(AppStore)
  protected readonly pose = POSES[Math.floor(Math.random() * POSES.length)]
  protected readonly paso = signal<'pose' | 'revisando' | 'listo'>('pose')

  protected tomar() {
    this.paso.set('revisando')
    setTimeout(() => {
      this.store.verify()
      this.paso.set('listo')
    }, 900)
  }
}
