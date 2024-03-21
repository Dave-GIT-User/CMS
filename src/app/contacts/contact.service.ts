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
  maxContactId: number = 0;
  
  constructor(private http: HttpClient) {  }
  //private dbUrl = 'https://wdd430-cms-e3d85-default-rtdb.firebaseio.com/contacts.json'
  private dbUrl = 'http://localhost:3000/contacts';

  getContacts(): void {
    this.http.get(this.dbUrl)
    .subscribe({ 
      /*
      next: (contactData: {message: string, contacts: contact[]}) => {
        console.log(contactData.message);
        //console.log(contactData.contacts); 

          this.contacts = contactData.contacts;
      */
      next: (contactData: {message: string, contacts: Contact[]}) => {
        {
          console.log(contactData.message);
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
          this.maxContactId = this.getMaxContactId();
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
  
  storeContacts() {
    // may not be necessary since my verion has all string fields.
    // const contacts = JSON.stringify(this.contacts); 
    this.http.put<'application/json'>(this.dbUrl, this.contacts)
    .subscribe({
    next: (responseData) => {
      this.maxContactId = this.getMaxContactId();
      this.contactListChangedEvent.next(this.contacts.slice());
    },
      // could / should also inform the user
      error: (error) => {
        this.contactIOError.next("Error storing contacts!");
        console.log('storeContacts error '+error)
      }
    })
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
    const id  = contact.id;
    if (id == '0') {
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
        this.maxContactId = this.getMaxContactId();
        this.contactListChangedEvent.next(this.contacts.slice());
      },
      error: (msg) => {
        this.contactIOError.next("Error deleting a contact!");
        console.log('Delete contact error '+msg.error);
      }
    })
  }
  /*
deletecontact(contact: contact) {
    if (!contact) {
       return;
    }
    const id = contact.id;
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
       return;
    }
    this.contacts.splice(pos, 1);
    // use the more granular delete operation.
    this.http.delete<'application/json'>(this.dbUrl+'/'+id)
    .subscribe({
      next: (responseData) => {
        this.maxcontactId = this.getMaxcontactId();
        this.contactListChangedEvent.next(this.contacts.slice());
      },
      error: (msg) => {
        this.contactIOError.next("Error deleting a contact!");
        console.log('Delete contact error '+msg.error);
      }
    })
   }
  */
  private getMaxContactId(): number {
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
