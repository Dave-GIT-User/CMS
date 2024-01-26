import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'cms';
  contactsVisible:boolean = false;
  documentsVisible: boolean = true;
  messagesVisible: boolean = false;
  onClickDocuments() {
    this.documentsVisible = true;
    this.contactsVisible = false;
    this.messagesVisible = false;
  }
  onClickContacts() {
    this.documentsVisible = false;
    this.contactsVisible = true;
    this.messagesVisible = false;
  }
  onClickMessages() {
    this.documentsVisible = false;
    this.contactsVisible = false;
    this.messagesVisible = true;
  }
}
