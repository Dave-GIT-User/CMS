import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Contact } from '../contact.model'
import { ContactService } from '../contact.service';
import { MessageService } from '../../messages/message.service';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css'
})
export class ContactListComponent implements OnInit, OnDestroy {
  term: string = '';

  contacts: Contact[] = []; 
  private subscription: Subscription = new Subscription();

  constructor(private contactService: ContactService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.contacts = this.contactService.getContacts();
    this.subscription = this.contactService.contactListChangedEvent.subscribe(
      (updatedcontacts: Contact[]) => {
        this.contacts=updatedcontacts;
        this.messageService.purgeMissingSenders();
         }
    ); 
  }

  search(value: string) {
    this.term = value;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}