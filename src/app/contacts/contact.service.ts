import { Injectable, EventEmitter } from '@angular/core';

import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contacts: Contact[] = [];
  contactSelectedEvent: EventEmitter<Contact>= new EventEmitter();
  constructor() {
    this.contacts = MOCKCONTACTS;
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
}