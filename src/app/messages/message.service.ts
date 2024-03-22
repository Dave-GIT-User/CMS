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
  //private dbUrl = 'https://wdd430-cms-e3d85-default-rtdb.firebaseio.com/messages.json'
  private dbUrl = 'http://localhost:3000/messages';

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
          for (let msg of this.messages) {
            if (!msg.sender) {
              this.deleteMessage(msg);
            }
          }
          //console.log(messageData.message);
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
      this.maxMessageId = this.getMaxMessageId();
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

  addMessage(newMessage: Message) {
    this.maxMessageId++;
    newMessage.id = ''+this.maxMessageId;
    this.messages.push(newMessage);

    this.http.post<'application/json'>(this.dbUrl+'/'+newMessage.id, newMessage)
    .subscribe({
      next: (responseData) => {
        this.maxMessageId = this.getMaxMessageId();
        this.messageListChangedEvent.next(this.messages.slice());
      },
      error: (msg) => {
        this.messageIOError.next("Error adding a message!");
        console.log('Add message error '+msg.error);
      }
    })
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
