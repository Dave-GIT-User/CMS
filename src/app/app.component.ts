import { Component } from '@angular/core';

@Component({
  selector: 'cms-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'cms';
  itemSelected: string = 'documents';
  onItemSelected(item: string) { 
    this.itemSelected = item;
  }
}
