import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Message } from '../message.model';
import { MessageService } from '../message.service';
import { Contact } from '../../contacts/contact.model';
import { ContactService } from '../../contacts/contact.service';
import { LoginService } from '../../contacts/login/login.service';


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
    private router:Router,
    private loginService: LoginService) {}

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
          this.message = this.messageService.getMessage(this.id);
          if (this.message === null) {
            this.router.navigate(['/messages']);
            return;
          }
          this.contact = this.contactService.getContact(this.message.sender);        
         }
    );
  }
  canDelete() {
    // browser reset
    if (!this.message) {
      this.router.navigate(['/messages']);
      return;
    }    
    return (this.loginService.getLoggedId() == this.message.sender || 
      this.loginService.getLoggedAdmin() == '1');
  }

  onDelete() {
    this.messageService.deleteMessage(this.message);
    this.router.navigate(['/messages']);
  }

  getSender() {
    // browser reset
    if (!this.contact) {
      this.router.navigate(['/messages']);
      return ""; 
    }
    return this.contact.name;
  }  
}

