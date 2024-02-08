import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cms-header',
  templateUrl: './header.component.html'
  //styleUrl: './header.component.css'
})

export class HeaderComponent {
  @Output() itemSelected: EventEmitter<string>= new EventEmitter();
  onSelectItem(choice: string) {
    this.itemSelected.emit(choice);
  }

}
