import { Component } from '@angular/core';
import { Contact } from '../contacts/contact.model';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css'
})
export class ContactsComponent {
  selectedContact: Contact;
  onSelectedContact(contact: Contact) {
    this.selectedContact = contact;
  }
}
