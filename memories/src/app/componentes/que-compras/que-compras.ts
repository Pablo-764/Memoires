import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'

/**
 * "Qué compras y qué no": se muestra siempre antes del botón de pago. Pagar da
 * herramientas y visibilidad medida; no garantiza conexiones, respuestas ni citas.
 */
@Component({
  selector: 'app-que-compras',
  imports: [RouterLink],
  styleUrl: './que-compras.css',
  template: `
    <section class="qc" aria-labelledby="qc-titulo">
      <h2 id="qc-titulo" class="text-lg font-extrabold">Qué compras y qué no</h2>
      <p class="qc-lead">
        Pagar aumenta tu visibilidad y te da herramientas. <strong>No garantiza matches, respuestas ni citas</strong>: eso depende de que la
        otra persona también quiera.
      </p>
      <ul class="qc-list">
        <li>El orden por afinidad es el mismo para todos: tu plan no cambia cómo te recomendamos.</li>
        <li>Los perfiles impulsados se marcan “Impulsado” y nunca son más de 1 de cada 10 sugerencias.</li>
        <li>La seguridad nunca se cobra.</li>
        <li>Lo que más te hace visible es gratis: verificarte y completar tu perfil. El plan de pago no reemplaza eso.</li>
        <li>Lo que más ayuda a conectar también es gratis: fotos claras, tres preguntas respondidas y comentar algo concreto. <a routerLink="/app/perfil" class="link-soft font-semibold">Guía de perfil</a></li>
      </ul>
      <a routerLink="/terminos-suscripcion" class="btn btn-ghost btn-sm mt-2">Términos de la suscripción</a>
    </section>
  `,
  host: { class: 'block' },
})
export class QueCompras {}
