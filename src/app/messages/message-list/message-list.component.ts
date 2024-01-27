import { Component, Output, EventEmitter } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css'
})
export class MessageListComponent {
  messages: Message[] = [
    new Message('001', 'all free', 'Alert message', 'Al'),
    new Message('002', 'be good', 'Be Careful', 'Bob')
  ]
  onAddMessage(message: Message) {
    this.messages.push(message);
  }

}
