import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
  //styleUrl: './header.component.css'
})

export class HeaderComponent {
  @Output() documentsClicked: EventEmitter<void>= new EventEmitter();
  @Output() contactsClicked: EventEmitter<void>= new EventEmitter();
  @Output() messagesClicked: EventEmitter<void>= new EventEmitter();
  onClickDocuments() {
    this.documentsClicked.emit();
  }
  onClickContacts() {
    this.contactsClicked.emit();
  }
  onClickMessages() {
    this.messagesClicked.emit();
  }
}
