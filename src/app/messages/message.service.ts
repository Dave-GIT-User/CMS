import { Injectable, EventEmitter } from '@angular/core';

import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import { ContactService } from '../contacts/contact.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messages: Message[] = [];
  messageSelectedEvent: EventEmitter<Message>= new EventEmitter();
  messageChangedEvent: EventEmitter<Message[]>= new EventEmitter();

  constructor(private contactService: ContactService) {
    this.messages = MOCKMESSAGES;
  }
  
  purgeMissingSenders() {
    for (const message of this.messages) {
      const sender: string = message.sender;
      if (this.contactService.getContact(sender)===null) {
        this.deleteMessage(message);
      }
    }
    this.messageChangedEvent.emit(this.messages.slice());
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
 }
 
  getMessages() {
    return this.messages.slice();
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
    this.messages.push(message);
    this.messageChangedEvent.emit(this.messages.slice());
  }

  // it will work for a while to just take the size of the array as the next id.
  // The problem is if a record has been deleted from the middle and then
  // one adds a new one on the end. This just adds one to the id of the last message.
  getNextId(): string {
    if (this.messages.length == 0)
      return '0';
    else {
      return '' + parseInt(this.messages[this.messages.length-1].id) + 1
    }
  }
}
