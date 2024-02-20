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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // add a dummy contact for testing
  addContact() {
    this.contactService.addcontact(new Contact('0','Paul E. Neuman', 'NoEmail@NoEmail.com', '1-800-NO-PHONE', '../../assets/images/AlfredENeuman.jpg'));
  }
}