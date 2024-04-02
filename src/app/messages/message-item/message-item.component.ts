import { Component, Input, OnInit } from '@angular/core';

import { Message } from '../message.model';
import { Contact } from '../../contacts/contact.model'
import { ContactService } from '../../contacts/contact.service';
import { Router } from '@angular/router';


@Component({
  selector: 'cms-message-item',
  templateUrl: './message-item.component.html',
  styleUrl: './message-item.component.css'
})
export class MessageItemComponent implements OnInit{
  @Input() messageIndex: string;
  @Input() message: Message; 
  messageSender: string = '';
  constructor(private contactService: ContactService,
    private router: Router) {}
  ngOnInit() {
    if (!this.message){
      console.log('ngInit in message item');
    }
    const contact: Contact = this.contactService.getContact(this.message.sender);
    if (contact) {
      this.messageSender = contact.name;
    }
    else {
      this.router.navigate(['/messages']);
    }
  }
}
