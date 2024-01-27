import { Component, Output, EventEmitter } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css'
})
export class MessageListComponent {
  @Output() messageWasSelected: EventEmitter<Message>= new EventEmitter();
  messages: Message[] = [
    new Message('001', 'all free', 'Alert message', 'Al'),
    new Message('002', 'be good', 'Be Careful', 'Bob')
  ]
  onSelected(message: Message) {
    this.messageWasSelected.emit(message);
  }
}
/*
  @Output() contactWasSelected: EventEmitter<Contact>= new EventEmitter();
  onSelected(contact: Contact) {
    console.log('ContactList: contact ',contact.name," was selected.");
    this.contactWasSelected.emit(contact);
  }
*/