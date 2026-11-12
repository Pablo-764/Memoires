import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { AsciiArt } from '../../componentes/ascii-art/ascii-art'

@Component({
  selector: 'app-rest',
  imports: [AsciiArt, RouterLink],
  styleUrl: './rest.css',
  templateUrl: './rest.html',
})
export class Rest {}
