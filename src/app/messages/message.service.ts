import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Message } from './message.model';
import { ContactService } from '../contacts/contact.service';
import { HttpClient } from '@angular/common/http'
import { LoginService } from '../contacts/login/login.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messages: Message[] = [];

  //messageSelectedEvent: Subject<Message>=new Subject(); // for future use
  messageListChangedEvent: Subject<Message[]>=new Subject();
  messageIOError: Subject<string>=new Subject();
  //private dbUrl = 'https://wdd430-cms-e3d85-default-rtdb.firebaseio.com/messages.json'
  private dbUrl = 'http://localhost:3000';
  //private dbUrl = 'https://cms-api-3t5r.onrender.com';
  constructor(
    private contactService: ContactService,
    private http: HttpClient,
    private loginService: LoginService) { }

  getMessages(): void {
    // contacts are a prerequisite for messages.
    if (this.contactService.noContacts()) {
      this.contactService.getContacts();
    }
    this.http.get(this.dbUrl+'/messages')
    .subscribe({ 
      next: (messageData: {message: string, messages: Message[]}) => {
        {
          this.messages = messageData.messages;
        
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
  this.http.delete<'application/json'>(this.dbUrl+'/messages'+id)
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
    if (newMessage === null) {
      return;
    }
    newMessage.sender = this.loginService.getLoggedId();
    // now we will post just this record.
    this.http.post(this.dbUrl+'/messages/0', newMessage)
    .subscribe({
      next: (createdMessage: {statusMessage: string, returnedMessage: Message}) => {
        this.messages.push(createdMessage.returnedMessage);

        // this fixes a timing issue observed after adding a new message
        this.getMessages();

        this.messageListChangedEvent.next(this.messages.slice());
      },
      error: (msg) => {
        this.messageIOError.next("Error adding a message!");
        console.log('Add message error '+msg.error);
      }
    })
  }

}
