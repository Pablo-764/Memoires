import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { IntentConstellation } from '../../componentes/intent-constellation/intent-constellation'

@Component({
  selector: 'app-rest',
  imports: [IntentConstellation, RouterLink],
  styleUrl: './rest.css',
  templateUrl: './rest.html',
})
export class Rest {}
