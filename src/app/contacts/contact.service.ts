import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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
  constructor(private http: HttpClient) {  }
  private dbUrl = 'https://wdd430-cms-e3d85-default-rtdb.firebaseio.com/contacts.json'

  getContacts(): Contact[] {
   // return this.Contacts.slice();
    this.http.get(this.dbUrl)
    .subscribe({ 
      next: (Contacts: Contact[]) => {
        {
          this.contacts = Contacts;
          /*
          // hold off sorting contacts for now.
          // perhaps single contacts could be sorted,followed by group contacts
          // sort the Contacts.
          // from sample code at  
          // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
          this.contacts.sort((a, b) => {
            //compare function
            const nameA = a.name.toUpperCase(); // ignore upper and lowercase
            const nameB = b.name.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
          
            // names must be equal
            return 0;
          });
          */
          
          let ContactListClone: Contact[] = this.contacts.slice();
          console.log('Contact list has now been updated')
          this.maxContactId = this.getmaxContactId();
          this.contactListChangedEvent.next(ContactListClone);
          return  ContactListClone;
        }
      }, 
      // we could perhaps give the user some feedback.
      error: (error) => console.log(error)
    });
    return null;
  }
  noContacts() {
    return this.contacts.length  === 0;
  }
  storeContacts() {
    // may not be necessary since my verion has all string fields.
    // const contacts = JSON.stringify(this.contacts); 
    this.http.put<'application/json'>(this.dbUrl, this.contacts)
    .subscribe({
    next: (responseData) => {
      this.maxContactId = this.getmaxContactId();
      this.contactListChangedEvent.next(this.contacts.slice());
    },
      // could / should also inform the user
      error: (error) => console.log('StoreContacts error '+error.value)
    })
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
    this.storeContacts();
  }
  
  private getmaxContactId(): number {
    let highest: number = 0;
    for (let contact of this.contacts) {
      if (+contact.id > highest) {
        highest = +contact.id;
      }
    }
    return highest;
  }

  addContact(newContact: Contact ) {
    if (newContact === null)
      return;
    this.maxContactId++;
    newContact.id = ''+this.maxContactId;
    this.contacts.push(newContact);
    let contactListClone: Contact[] = this.contacts.slice();
    this.storeContacts();
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
    this.storeContacts();
    return newContact;
  }
}
