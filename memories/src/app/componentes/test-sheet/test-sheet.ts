import { Component, computed, output, signal } from '@angular/core'
import { AFIRMACIONES, EJES, ejesDe } from '../../modelos/personalidad'
import { Modal } from '../modal/modal'

type Ejes = [number, number, number, number]

const ESCALA = ['Nada', 'Poco', 'Neutral', 'Bastante', 'Mucho']

/** Test de personalidad opcional: 12 afirmaciones con deslizador y 4 ejes propios. */
@Component({
  selector: 'app-test-sheet',
  imports: [Modal],
  template: `
    <app-modal title="Test de personalidad" (closed)="closed.emit()">
      <p class="font-mono text-xs uppercase tracking-wider text-ink-2">{{ i() + 1 }} de {{ afirmaciones.length }}</p>
      <p class="mt-1 text-xl font-extrabold">{{ afirmaciones[i()].texto }}</p>
      <input class="mt-6 w-full" type="range" min="-2" max="2" step="1" aria-label="Qué tanto te describe" [value]="r()[i()]" [attr.aria-valuetext]="escala[r()[i()] + 2]" (input)="set(+$any($event.target).value)" />
      <div class="flex justify-between text-xs text-ink-2" aria-hidden="true"><span>Nada</span><span>Neutral</span><span>Mucho</span></div>
      <p class="mt-1 font-semibold text-tint-ink">{{ escala[r()[i()] + 2] }}</p>
      <div class="ejes mt-5">
        @for (e of ejes; track e.izq; let k = $index) {
          <div class="eje">
            <span>{{ e.izq }}</span>
            <span class="eje-barra"><span class="eje-punto" [style.left.%]="50 + vista()[k] * 50"></span></span>
            <span class="text-right">{{ e.der }}</span>
          </div>
        }
      </div>
      <div class="mt-6 flex gap-2">
        @if (i() > 0) { <button type="button" class="btn btn-ghost" (click)="i.set(i() - 1)">Atrás</button> }
        <span class="flex-1"></span>
        @if (i() < afirmaciones.length - 1) {
          <button type="button" class="btn btn-primary" (click)="i.set(i() + 1)">Siguiente</button>
        } @else {
          <button type="button" class="btn btn-primary" (click)="done.emit(vista())">Guardar</button>
        }
      </div>
    </app-modal>
  `,
  styles: `
    input[type='range'] { accent-color: var(--tint); }
    .ejes { display: grid; gap: 0.5rem; font-size: 0.75rem; color: var(--color-ink-2); }
    .eje { display: grid; grid-template-columns: 6.5rem 1fr 6.5rem; align-items: center; gap: 0.5rem; }
    .eje-barra { position: relative; height: 2px; background: var(--color-line); }
    .eje-punto { position: absolute; top: 50%; width: 10px; height: 10px; border-radius: 50%; background: var(--tint); translate: -50% -50%; transition: left 300ms ease; }
  `,
})
export class TestSheet {
  readonly closed = output<void>()
  readonly done = output<Ejes>()

  protected readonly afirmaciones = AFIRMACIONES
  protected readonly ejes = EJES
  protected readonly escala = ESCALA
  protected readonly i = signal(0)
  protected readonly r = signal<number[]>(Array(12).fill(0))
  protected readonly vista = computed(() => ejesDe(this.r()))

  protected set(v: number) {
    this.r.update((r) => r.map((x, k) => (k === this.i() ? v : x)))
  }
}
