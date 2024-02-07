import { Component, OnInit } from '@angular/core';

import { Message } from '../message.model';
import { MessageService } from '../message.service';


@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css'
})
export class MessageListComponent implements OnInit{
  messages: Message[] = [];
  constructor(private messageService: MessageService) {}


  ngOnInit() {
    this.messages = this.messageService.getMessages();
    if (this.messages) {
      this.messageService.messageChangedEvent
     .subscribe(
        (messages: Message[]) => {
          this.messages = messages;
        }
      );
    }
    else {
      alert('message not found!');
    }
  }
}
