import { Component, OnInit } from '@angular/core';
import { Contact } from '../contact.model'
import { ContactService } from '../contact.service';
import { MessageService } from '../../messages/message.service';
import { Message } from '../../messages/message.model';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css'
})
export class ContactListComponent implements OnInit{

  contacts: Contact[] = []; 


  constructor(private contactService: ContactService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.contacts = this.contactService.getContacts();
    this.contactService.contactChangedEvent.subscribe(
      (updatedcontacts: Contact[]) => {
        this.contacts=updatedcontacts;
        this.messageService.purgeMissingSenders();
         }
    );
  }
}