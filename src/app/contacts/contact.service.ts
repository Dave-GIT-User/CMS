import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contacts: Contact[] = [];
  contactSelectedEvent: Subject<Contact>= new Subject();
  contactListChangedEvent: Subject<Contact[]>= new Subject();
  maxContactId: number = 0;
  constructor() {
    this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxcontactId();
  }
  // get a copy of the contacts array.
  getContacts(): Contact[] {
    return this.contacts.slice();
  }

  // search for a contact with the expected id.
  getContact(id: string): Contact {
    // changed let contact to const contact
    // based on lint.
    for (const contact of this.contacts) {
      if (contact.id === id)
        return contact;
    }
    // how do we handle failure?
    return null; 
    // but now null must be intercepted if it happens...
  }
  deleteContact(contact: Contact) {
    if (!contact) {
       return;
    }
    if (contact.id === '0') {
      alert('Deleting the primary contact is not allowed!');
      return;
    }
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
       return;
    }
    this.contacts.splice(pos, 1);
    this.contactListChangedEvent.next(this.contacts.slice());
  }
  private getMaxcontactId(): number {
    let highest: number = 0;
    for (let contact of this.contacts) {
      if (+contact.id > highest) {
        highest = +contact.id;
      }
    }
    return highest;
  }

  addcontact(newContact: Contact ) {
    if (newContact === null)
      return;
    this.maxContactId++;
    newContact.id = ''+this.maxContactId;
    this.contacts.push(newContact);
    let contactListClone: Contact[] = this.contacts.slice();
    this.contactListChangedEvent.next(contactListClone);
  }

  updateContact(originalContact: Contact, newContact: Contact): Contact {
    if (newContact === null)
      return null;
    const id: string = originalContact.id;
    // look for the original Contact
    let i: number = 0;
    for (const Contact of this.contacts) {
      if (Contact.id === id)
        break;
      i++;
    }
    // did we find it?
    if (i==this.contacts.length) 
      return null;
    newContact.id = id;
    this.contacts[i] = newContact;
    let ContactListClone: Contact[] = this.contacts.slice();
    this.contactListChangedEvent.next(ContactListClone);
    return newContact;
  }
}
