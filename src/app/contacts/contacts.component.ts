import { Component, OnInit } from '@angular/core';
import { Contact } from '../contacts/contact.model';
import { ContactService } from './contact.service';

@Component({
  selector: 'cms-contacts',
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css'
})
export class ContactsComponent implements OnInit {
  selectedContact: Contact;

  constructor(private contactService: ContactService) {}

  onSelectedContact(contact: Contact) {
    this.selectedContact = contact;
  }
  ngOnInit(): void {
    this.contactService.contactSelectedEvent.subscribe((contact: Contact) => {
    this.selectedContact = contact;
    });
  }
}
