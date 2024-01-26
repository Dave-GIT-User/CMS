import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'cms';
  itemSelected: string = 'documents';
  onItemSelected(item: string) {
    this.itemSelected = item;
  }
  /*
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
  */
}
