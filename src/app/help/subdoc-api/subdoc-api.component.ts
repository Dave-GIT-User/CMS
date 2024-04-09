import { Component } from '@angular/core';

@Component({
  selector: 'app-subdoc-api',
  templateUrl: './subdoc-api.component.html',
  styleUrl: './subdoc-api.component.css'
})
export class SubdocApiComponent {
  leftBrace() {
    return '{';
  }
  rightBrace() {
    return '}';
  }

}
