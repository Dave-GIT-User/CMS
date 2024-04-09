import { Component } from '@angular/core';

@Component({
  selector: 'app-purging-orphans',
  templateUrl: './purging-orphans.component.html',
  styleUrl: './purging-orphans.component.css'
})
export class PurgingOrphansComponent {
  leftBrace() {
    return '{';
  }
  rightBrace() {
    return '}';
  }
}
