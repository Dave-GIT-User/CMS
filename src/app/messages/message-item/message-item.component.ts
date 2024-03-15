import { Component, Input, OnInit } from '@angular/core';

import { Message } from '../message.model';
import { Contact } from '../../contacts/contact.model'
import { ContactService } from '../../contacts/contact.service';


@Component({
  selector: 'cms-message-item',
  templateUrl: './message-item.component.html',
  styleUrl: './message-item.component.css'
})
export class MessageItemComponent implements OnInit{
  // strict warning: Property 'message' has no initializer and is
  // not definitely assigned in the constructor.
  // @Input() message: Message;
  // response: set up a default value.
  @Input() message: Message = new Message(' ', ' ', ' ', ' ');
  // strict warning: Property 'messageSender' has no initializer and is
  // not definitely assigned in the constructor.
  //  messageSender: string;
  // response: set up a default value.
  messageSender: string = '';
  constructor(private contactService: ContactService) {}
  ngOnInit() {
    const contact: Contact = this.contactService.getContact(this.message.sender);
    if (contact) {
      this.messageSender = contact.name;
    }
    else {
      alert('Contact not found!');
    }
  }
}
