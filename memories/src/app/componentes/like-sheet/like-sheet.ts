import { Component, OnInit, computed, inject, input, output, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { AppStore } from '../../servicios/app-store'
import { Modal } from '../modal/modal'

export interface LikeEnvio {
  comment: string
  golden: boolean
}

/**
 * "Me interesa" a algo concreto (una pregunta o su foto) con comentario opcional.
 * Si el interés es mutuo, el comentario llega como primer mensaje. El hilo dorado
 * pide comentario y aparece primero; uno gratis por semana.
 */
@Component({
  selector: 'app-like-sheet',
  imports: [Modal, FormsModule],
  template: `
    <app-modal [title]="golden() ? 'Hilo dorado para ' + name() : 'Me interesa'" (closed)="closed.emit()">
      @if (quote()) {
        <blockquote class="cita">
          <span>{{ about() }}</span>
          {{ quote() }}
        </blockquote>
      } @else {
        <p class="text-ink-2">Sobre {{ about() }}.</p>
      }
      <label for="like-c" class="mt-5 block text-sm font-semibold">
        {{ golden() ? 'Tu comentario (obligatorio)' : 'Agrega un comentario (opcional)' }}
      </label>
      <textarea id="like-c" class="field mt-1" rows="3" maxlength="160" [placeholder]="'Escribe algo sobre ' + about() + '…'" [ngModel]="comment()" (ngModelChange)="comment.set($event)"></textarea>
      <p class="mt-1 text-xs text-ink-2">Si a {{ name() }} también le interesa, tu comentario será el primer mensaje.</p>

      <label class="dorado mt-4">
        <input type="checkbox" [checked]="golden()" [disabled]="!store.goldenLeft() && !golden()" (change)="golden.set($any($event.target).checked)" />
        <span>
          <strong>Enviar como hilo dorado</strong>
          <span class="block text-xs text-ink-2">Aparece primero para {{ name() }}. Te quedan {{ store.goldenLeft() }} esta semana. No obliga a responder.</span>
        </span>
      </label>

      <button type="button" class="btn btn-primary mt-6 w-full" [disabled]="!valid()" (click)="send.emit({ comment: comment().trim(), golden: golden() })">
        {{ golden() ? 'Enviar hilo dorado' : 'Me interesa' }}
      </button>
    </app-modal>
  `,
  styles: `
    .cita { padding: 1rem 1.125rem; border-radius: var(--radius-card); background: var(--wash); font-size: 1.0625rem; font-weight: 600; }
    .cita span { display: block; font-size: 0.75rem; font-weight: 500; color: var(--color-ink-2); }
    .dorado { display: flex; gap: 0.75rem; align-items: flex-start; cursor: pointer; }
    .dorado input { width: 1.125rem; height: 1.125rem; margin-top: 0.15rem; accent-color: var(--hobby-ink, var(--tint)); flex: none; }
  `,
})
export class LikeSheet implements OnInit {
  readonly name = input.required<string>()
  readonly about = input.required<string>()
  readonly quote = input('')
  readonly startGolden = input(false)
  readonly send = output<LikeEnvio>()
  readonly closed = output<void>()

  protected readonly store = inject(AppStore)
  protected readonly comment = signal('')
  protected readonly golden = signal(false)
  protected readonly valid = computed(() => !this.golden() || this.comment().trim().length >= 2)

  ngOnInit() {
    this.golden.set(this.startGolden() && this.store.goldenLeft() > 0)
  }
}
