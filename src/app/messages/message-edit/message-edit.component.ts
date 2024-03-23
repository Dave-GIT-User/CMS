import { Component} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { Message } from '../message.model';
import { MessageService } from '../message.service';


@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrl: './message-edit.component.css'
})

export class MessageEditComponent {
  message: Message;

subject: string = '';
messageText: string = '';
oldSubject: string = '';
oldMessageText: string = ''
  constructor (
    private messageService: MessageService,
    private router: Router) {}

  onSendMessage(form: NgForm) {
    const value = form.value;
    const newMessage: Message = new Message(
      '0', // message id will be updated by the service
      value.subject,
      value.msgText,
      '0' // my contact id, as the sender
      );
      this.messageService.addMessage(newMessage);
      this.router.navigate(['/messages']);
  }

/*
  onSendMessage() {
    if (this.subject == this.oldSubject && this.messageText.length > 0) {
      return; // key bounce, most likely.
    }
    this.oldSubject = this.subject;
    this.oldMessageText = this.messageText;

    this.messageService.addMessage(new Message(
      '0', 
      this.subject,
      this.message, 
      '0' // id of my contact
      ));
  }
 */
/*
  onUpdateSubject(event: Event) {
    this.subject = (event.target as HTMLInputElement).value;
  }

  onUpdateMessage(event: Event) {
    this.messageText = (event.target as HTMLInputElement).value;
  }
*/
  onCancel() {
    this.router.navigate(['/messages']);
  }
}
