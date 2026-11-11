import { Component, input } from '@angular/core'

@Component({
  selector: 'app-field',
  styleUrl: './field.css',
  templateUrl: './field.html',
  host: { class: 'block' },
})
export class Field {
  readonly for = input.required<string>()
  readonly label = input.required<string>()
  readonly error = input<string>()
}
