import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Message } from './message.model';
import { ContactService } from '../contacts/contact.service';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messages: Message[] = [];

  //messageSelectedEvent: Subject<Message>=new Subject(); // for future use
  messageListChangedEvent: Subject<Message[]>=new Subject();
  messageIOError: Subject<string>=new Subject();
  private maxMessageId = 0;
  private dbUrl = 'https://wdd430-cms-e3d85-default-rtdb.firebaseio.com/messages.json'


  constructor(
    private contactService: ContactService,
    private http: HttpClient) { }

  getMessages(): void {
    // contacts are a prerequisite for messages.
    // Will this timing work?
    if (this.contactService.noContacts()) {
      this.contactService.getContacts();
    }
   // return this.Messages.slice();
    this.http.get(this.dbUrl)
    .subscribe({ 
      next: (Messages: Message[]) => {
        {
          this.messages = Messages;
          this.maxMessageId = this.getMaxMessageId();
          /*
          // sort the Messages.
          // from sample code at  
          // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
          this.messages.sort((a, b) => {
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
          
          let messageListClone: Message[] = this.messages.slice();
          this.messageListChangedEvent.next(messageListClone);
          this.maxMessageId = this.getMaxMessageId();
        }
      }, 
      // we could perhaps give the user some feedback.
      error: (error) => {
        console.log(error);
        this.messageIOError.next("Error fetching messages!");
      }
    });
  }

  noMessages() {
    return this.messages.length  === 0;
  }

  storeMessages() {
    // may not be necessary since my verion has all string fields.
    // const Messages = JSON.stringify(this.Messages); 
    this.http.put<'application/json'>(this.dbUrl, this.messages)
    .subscribe({
      next: (responseData) => {
        this.maxMessageId = this.getMaxMessageId();
        this.messageListChangedEvent.next(this.messages.slice());
      },
      // could / should also inform the user
      error: (error) => {
        console.log('StoreMessages error '+error.value);
        this.messageIOError.next("Error storing messages!");
      }
    })

  }  purgeMissingSenders() {
    for (const message of this.messages) {
      const sender: string = message.sender;
      if (this.contactService.getContact(sender)===null) {
        this.deleteMessage(message);
      }
    }
    this.messageListChangedEvent.next(this.messages.slice());
  }

  // note, this is not being used as of week 6.
  deleteMessage(message: Message) { //may need more if user can separately delete a message.
    if (!message) {
       return;
    }
    const pos = this.messages.indexOf(message); 
    if (pos < 0) {
       return;
    }
    this.messages.splice(pos, 1);
    this.storeMessages();
 }
 
  // week 5 note: This is not used.
  // Presumably we will use it in future.
  // search for a message with the expected id.
  getMessage(id: string): Message {
    // changed let message to const message
    // based on Lint complaint.
    for (const message of this.messages) { 
      if (message.id === id)
        return message;
    }
    // how do we handle failure?
    return null; 
    // but now null must be intercepted if it happens...
  }

  addMessage(message: Message) {
    this.maxMessageId++;
    message.id = ''+this.maxMessageId;
    this.messages.push(message);
    this.storeMessages();
  }

  private getMaxMessageId(): number {
    let highest: number = 0;
    for (let message of this.messages) {
      if (+message.id > highest) {
        highest = +message.id;
      }
    }
    return highest;
  }
}
