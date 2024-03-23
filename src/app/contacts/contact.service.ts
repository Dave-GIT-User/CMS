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

  contactListChangedEvent: Subject<Contact[]>= new Subject();
  contactIOError: Subject<string>=new Subject();
  
  constructor(private http: HttpClient) {  }
  //private dbUrl = 'https://wdd430-cms-e3d85-default-rtdb.firebaseio.com/contacts.json'
  private dbUrl = 'http://localhost:3000/contacts';

  getContacts(): void {
    this.http.get(this.dbUrl)
    .subscribe({ 
      next: (contactData: {contact: string, contacts: Contact[]}) => {
        {
          console.log(contactData.contact);
          this.contacts = contactData.contacts;
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
          this.contactListChangedEvent.next(ContactListClone);
        }
      }, 
      // we could perhaps give the user some feedback.
      error: (error) => {
        this.contactIOError.next("Error fetching contacts!");
        console.log('getContacts error '+error)
      }
    });
  }
  
  noContacts() {
    return this.contacts.length  === 0;
  }
 
  getContact(id: string): Contact {
    for (const contact of this.contacts) {
      if (contact.id === id) {
        return contact;
      } else {
        if (contact.group){
          for(const subContact of contact.group) {
            if (id === subContact.id) {
              return subContact;
            }
          }
        }
      }
    }
    return null; 
  }

  deleteContact(contact: Contact) {
    if (!contact) {
       return;
    }
    const id = contact.id
    if (id === '0') {
      alert('Deleting the primary contact is not allowed!');
      return;
    }
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
       return;
    }
    this.contacts.splice(pos, 1);
   // use the more granular delete operation.
    this.http.delete<'application/json'>(this.dbUrl+'/'+id)
    .subscribe({
      next: (responseData) => {
        this.contactListChangedEvent.next(this.contacts.slice());
      },
      error: (msg) => {
        this.contactIOError.next("Error deleting a contact!");
        console.log('Delete contact error '+msg.error);
      }
    })
   }

  addContact(newcontact: Contact ) {
    if (newcontact === null)
      return;
    let contactListClone: Contact[] = this.contacts.slice();
    // now we will post just this record
    newcontact.id = '1';
    this.http.post(this.dbUrl+'/1', newcontact)
    .subscribe({
      next: (responseData: {status: string, contact: Contact}) => {
        this.contacts.push(responseData.contact);
        console.log(responseData.contact);
        this.contactListChangedEvent.next(this.contacts.slice());
      },
      error: (contact) => {
        this.contactIOError.next("Error adding a contact!");
        console.log(contact);
      }
    })
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
    this.http.put<'application/json'>(this.dbUrl+'/'+id, newContact)
    .subscribe({
      next: (responseData) => {
        this.contactListChangedEvent.next(this.contacts.slice());
      },
      error: (msg) => {
        this.contactIOError.next("Error updating contact!");
        console.log('Update contact error '+msg.error);
      }
    })
    return newContact;
  }
}
