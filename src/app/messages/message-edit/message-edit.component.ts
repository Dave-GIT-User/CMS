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
    if (this.invalidForm(form)) {
      return;
    }
    const value = form.value;
    const newMessage: Message = new Message(
      '0', // message id will be updated by the API
      // scrape off leading or trailing whitespace
      value.subject.trim(),
      value.msgText.trim(),
      '0' // sender id will be updated by the messageService
      );
      this.messageService.addMessage(newMessage);
      this.router.navigate(['/messages']);
  }

    // defend against someone submitting a form with whitespace but no real content.
    invalidForm(form: NgForm) {
      const value = form.value;
      if (!value) {
        return true;
      }
      if (!value.subject || !value.msgText) {
        return true;
      }
      return (value.subject.trim().length == 0 || value.msgText.trim().length == 0);
    }

  onCancel() {
    this.router.navigate(['/messages']);
  }
}
