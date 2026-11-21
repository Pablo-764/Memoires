import { Component, OnInit, inject, input, output, signal } from '@angular/core'
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

type Paso = 'pose' | 'revisando' | 'listo' | 'id' | 'id-revisando' | 'id-listo'

/**
 * Verificación en dos niveles, siempre gratis. La selfie con pose al azar (sello azul)
 * es obligatoria para conectar; la identificación oficial (sello dorado) es opcional.
 * En la demo las dos se simulan.
 */
@Component({
  selector: 'app-verify-sheet',
  imports: [Modal, Seal],
  template: `
    <app-modal [title]="titulo()" (closed)="closed.emit()">
      @switch (paso()) {
        @case ('pose') {
          <p class="lema">Nadie habla con perfiles falsos.</p>
          <p class="mt-1 text-ink-2">Pedimos una selfie con una pose al azar para confirmar que eres tú. Es gratis siempre.</p>
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
        @case ('listo') {
          <div class="flex flex-col items-center py-4 text-center" role="status">
            <app-seal class="azul" kind="verified" size="lg" />
            <p class="mt-4 text-xl font-extrabold">Perfil verificado</p>
            <p class="mt-1 text-ink-2">Tu sello azul ya se ve en tu perfil. Ya puedes conectar.</p>
            <button class="btn btn-primary mt-6 w-full" (click)="closed.emit()">Listo</button>
          </div>
          <div class="nivel">
            <app-seal kind="id" size="md" />
            <div class="min-w-0">
              <p class="font-bold">Segundo nivel, opcional</p>
              <p class="text-sm text-ink-2">Con tu identificación oficial ganas un sello dorado. No es requisito para nada.</p>
              <button class="btn btn-ghost btn-sm mt-1" (click)="paso.set('id')">Agregar identificación</button>
            </div>
          </div>
        }
        @case ('id') {
          <p class="text-ink-2">Toma una foto de tu INE o pasaporte. Solo comparamos el nombre y la cara con tu selfie; después se borra.</p>
          <p class="mt-3 text-sm text-ink-2">Demostración: no se sube ningún archivo; el botón simula la revisión.</p>
          <button class="btn btn-primary mt-6 w-full" (click)="tomarId()">Revisar identificación</button>
          <button class="btn btn-ghost mt-2 w-full" (click)="closed.emit()">Ahora no</button>
        }
        @case ('id-revisando') {
          <div class="flex flex-col items-center py-6 text-center" role="status">
            <span class="spinner" aria-hidden="true"></span>
            <p class="mt-4 font-semibold">Revisando tu identificación…</p>
          </div>
        }
        @default {
          <div class="flex flex-col items-center py-4 text-center" role="status">
            <app-seal kind="id" size="lg" />
            <p class="mt-4 text-xl font-extrabold">Identificación confirmada</p>
            <p class="mt-1 text-ink-2">Tu sello dorado se ve junto al azul.</p>
            <button class="btn btn-primary mt-6 w-full" (click)="closed.emit()">Listo</button>
          </div>
        }
      }
    </app-modal>
  `,
  styles: `
    .lema { font-size: 1.125rem; font-weight: 800; }
    .pose { margin: 1.25rem 0 0.75rem; padding: 1rem 1.125rem; border-radius: var(--radius-card); background: var(--wash); }
    .nivel { display: flex; gap: 0.875rem; align-items: flex-start; margin-top: 1.25rem; padding-top: 1.25rem; box-shadow: 0 -1px 0 var(--color-line); }
    .spinner { width: 2.5rem; height: 2.5rem; border-radius: 50%; border: 3px solid var(--color-line); border-top-color: var(--tint); animation: spin 800ms linear infinite; }
    @keyframes spin { to { transform: rotate(1turn); } }
    @media (prefers-reduced-motion: reduce) { .spinner { animation-duration: 3s; } }
  `,
})
export class VerifySheet implements OnInit {
  /** 'id' abre directo el segundo nivel (desde el perfil). */
  readonly nivel = input<'selfie' | 'id'>('selfie')
  readonly closed = output<void>()
  private readonly store = inject(AppStore)
  protected readonly pose = POSES[Math.floor(Math.random() * POSES.length)]
  protected readonly paso = signal<Paso>('pose')

  ngOnInit() {
    if (this.nivel() === 'id' && this.store.verified()) this.paso.set('id')
  }

  protected titulo() {
    return this.paso().startsWith('id') ? 'Identificación oficial' : 'Verifícate para conectar'
  }

  private espera() {
    return matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 900
  }

  protected tomar() {
    this.paso.set('revisando')
    setTimeout(() => {
      this.store.verify()
      this.paso.set('listo')
    }, this.espera())
  }

  protected tomarId() {
    this.paso.set('id-revisando')
    setTimeout(() => {
      this.store.verifyId()
      this.paso.set('id-listo')
    }, this.espera())
  }
}
