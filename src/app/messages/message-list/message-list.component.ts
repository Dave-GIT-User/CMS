import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Message } from '../message.model';
import { MessageService } from '../message.service';
import { ContactService } from '../../contacts/contact.service';


@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css'
})
export class MessageListComponent implements OnInit{
  messages: Message[] = [];
  errorMessage = "";
  subscription1: Subscription = new Subscription();
  subscription2: Subscription = new Subscription();

  constructor(
    private messageService: MessageService,
    private contactService: ContactService) {}


    ngOnInit(): void {
      this.messages = this.messageService.getMessages();
      this.subscription1 = this.messageService.messageListChangedEvent.subscribe(
        (updatedMessages: Message[]) => {
          this.messages=updatedMessages;
           }
      );
      this.subscription2 = this.messageService.messageIOError.subscribe(
        (error) => {
          this.errorMessage = error;
           }
      );
    }
    
  onClearError() {
    this.errorMessage = "";
  }
}
