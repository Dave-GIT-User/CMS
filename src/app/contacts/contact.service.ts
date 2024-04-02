import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Contact } from './contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contacts: Contact[] = [];

  contactListChangedEvent: Subject<Contact[]>= new Subject();
  contactIOError: Subject<string>=new Subject();

  // courtesy https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
  
  hashValue(name: string, password: string) {
    const str = name + password;
    var hash = 0, i, chr;
    if (str.length === 0) return 'xyz'+hash;
    for (i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return 'xyz'+hash;
  }
  
  constructor(private http: HttpClient) {  }
  //private dbUrl = 'https://wdd430-cms-e3d85-default-rtdb.firebaseio.com/contacts.json'
  private dbUrl = 'http://localhost:3000/contacts';
  //private dbUrl = 'https://cms-api-3t5r.onrender.com/contacts';

  getContacts(): void {
    this.http.get(this.dbUrl)
    .subscribe({ 
      next: (contactData: {contact: string, contacts: Contact[]}) => {
        {
          this.contacts = contactData.contacts;

          this.sortContacts();
          
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

  sortContacts() {
              // sort the Contacts on id (chronologically).
          // from sample code at  
          // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
          this.contacts.sort((a, b) => {
            //compare function
            const nameA = +a.id;
            const nameB = +b.id;
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
          
            // names must be equal
            return 0;
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

  addContact(newContact: Contact ) {
    if (newContact === null)
      return;
    // now we will post just this record
    newContact.id = '1';
    this.http.post(this.dbUrl+'/1', newContact)
    .subscribe({
      next: (responseData: {status: string, contact: Contact}) => {
        this.contacts.push(responseData.contact);
        // we want the next contact below the last normal contact
        // and above the staged contact groups like Programming Team.
        // The backend sets it up so in the event a contact id hits 100,
        // it becomes 200 instead. This leaves room for more groups
        // and not threaten to overwrite them.
        this.sortContacts();
        this.contactListChangedEvent.next(this.contacts.slice());
      },
      error: (contact) => {
        this.contactIOError.next("Error adding a contact!");
        console.log(contact);
      }
    })
  }
  
  updateContact(newContact: Contact): Contact {
    if (newContact === null)
    return null;
  const id: string = newContact.id;
  // look for the original contact
  let i: number = 0;
  for (const contact of this.contacts) {
    if (contact.id === id)
      break;
    i++;
  }
  // did we find it?
  if (i==this.contacts.length) 
    return null;
  newContact.id = id;
  this.contacts[i] = newContact;
    this.http.put(this.dbUrl+'/'+newContact.id, newContact)
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
  getContactByHash(name: string, hash: string): Contact {
          for (const contact of this.contacts) {
        if (contact.hash === hash) {
          if (contact.name === name)
            return contact;
        }
      return null; 
    }
  } 
}
