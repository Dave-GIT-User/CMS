import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Message } from '../message.model';
import { MessageService } from '../message.service';
import { ContactService } from '../../contacts/contact.service';
import { Contact } from '../../contacts/contact.model';


@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css'
})
export class MessageListComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  errorMessages = "";
  errorContacts = "";
  subscription1: Subscription = new Subscription();
  subscription2: Subscription = new Subscription();
  subscription3: Subscription = new Subscription();
  subscription4: Subscription = new Subscription();

  constructor(
    private messageService: MessageService,
    private contactService: ContactService) {}

    ngOnInit(): void {
      this.contactService.getContacts();

      this.subscription1 = this.contactService.contactListChangedEvent.subscribe(
        (contacts: Contact[]) => {
          // we don't need it here, but it would be nice to confirm it happened.
          console.log('message-list brought in contacts');
          this.messageService.getMessages();
           }
      );
      this.subscription2 = this.messageService.messageListChangedEvent.subscribe(
        (updatedMessages: Message[]) => {
          console.log('messsage-list brought in messages');
          this.messages=updatedMessages;
           }
      );
      // check for errors fetching contacts
      this.subscription3 = this.contactService.contactIOError.subscribe(
        (error) => {
          this.errorContacts = error;
           }
      );
      // check for errors fetching messages
      this.subscription4 = this.messageService.messageIOError.subscribe(
        (error) => {
          this.errorMessages = error;
           }
      );
    }
    
  onClearError() {
    this.errorContacts = "";
    this.errorMessages = "";
  }

  ngOnDestroy(): void {
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
    this.subscription3.unsubscribe();
    this.subscription4.unsubscribe();
  }
}
