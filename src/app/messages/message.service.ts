import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
// nice try but this needs different handling on the Angular side
//require('dotenv').config(); // no good here

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
  //private dbUrl = 'https://wdd430-cms-e3d85-default-rtdb.firebaseio.com/messages.json'
  
  // nice try but this needs different handling on the Angular side
  //private localServer = 'http://localhost:3000';
  //private baseUrl = process.env.SERVER || this.localServer;

  private dbUrl = 'https://wdd433dh-cms.netlify.app/messages';

  constructor(
    private contactService: ContactService,
    private http: HttpClient) { }

  getMessages(): void {
    // contacts are a prerequisite for messages.
    if (this.contactService.noContacts()) {
      this.contactService.getContacts();
    }
    this.http.get(this.dbUrl)
    .subscribe({ 
      next: (messageData: {message: string, messages: Message[]}) => {
        {
          // the messages are now clean, without _id and with the friendly id of the sender.  
          this.messages = messageData.messages;
          // drop any messages that are orphaned by deleted contacts
          for (let msg of this.messages) {
            if (!msg.sender) {
              this.deleteMessage(msg);
            }
          }
         
          // sort the Messages on the id field (chronologically)
          // from sample code at  
          // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
          this.messages.sort((a, b) => {
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
          
          let messageListClone: Message[] = this.messages.slice();
          this.messageListChangedEvent.next(messageListClone);
        }
      }, 
      error: (error) => {
        console.log(error);
        this.messageIOError.next("Error fetching messages!");
      }
    });
  }

  noMessages() {
    return this.messages.length  === 0;
  }
 
  deleteMessage(message: Message) { //may need more if user can separately delete a message.
    if (!message) {
       return;
    }
    const id = message.id;
    const pos = this.messages.indexOf(message); 
    if (pos < 0) {
       return;
    }
    this.messages.splice(pos, 1);
  // use the more granular delete operation.
  this.http.delete<'application/json'>(this.dbUrl+'/'+id)
  .subscribe({
    next: (responseData) => {
      this.messageListChangedEvent.next(this.messages.slice());
    },
    error: (msg) => {
      this.messageIOError.next("Error deleting a message!");
      console.log('Delete message error '+msg.error);
    }
  })
 }

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

  addMessage(newMessage: Message ) {
    if (newMessage === null)
      return;
    let messageListClone: Message[] = this.messages.slice();
    newMessage.id = '1';
    // now will post just this record. we
    this.http.post(this.dbUrl+'/1', newMessage)
    .subscribe({
      next: (responseData: {status: string, message: Message}) => {
        // replace sender field foreign key with the id '0', the "owner"
        responseData.message.sender = '0'
        this.messages.push(responseData.message);
        this.messageListChangedEvent.next(this.messages.slice());
      },
      error: (message) => {
        this.messageIOError.next("Error adding a message!");
        console.log(message);
      }
    })
  }
}
