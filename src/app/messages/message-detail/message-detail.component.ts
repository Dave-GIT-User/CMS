import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Message } from '../message.model';
import { MessageService } from '../message.service';
import { Contact } from '../../contacts/contact.model';
import { ContactService } from '../../contacts/contact.service';


@Component({
  selector: 'app-message-detail',
  templateUrl: './message-detail.component.html',
  styleUrl: './message-detail.component.css'
})
export class MessageDetailComponent implements OnInit {
  message: Message;
  contact: Contact;
  id: string;
  nativeWindow: any;

  constructor (
    private messageService: MessageService, 
    private contactService: ContactService,
    private route: ActivatedRoute, 
    private router:Router) {}

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
          this.message = this.messageService.getMessage(this.id);
          this.contact = this.contactService.getContact(this.message.sender);        
          if (this.message === null) {
            this.router.navigate(['/messages']);
            //alert('Message not found!');
          }
         }
    );
  }

  onDelete() {
    this.messageService.deleteMessage(this.message);
    this.router.navigate(['/messages']);
  }
  
}

