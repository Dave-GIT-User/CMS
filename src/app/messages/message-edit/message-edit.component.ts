import { Component, ViewChild, ElementRef, } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrl: './message-edit.component.css'
})

export class MessageEditComponent {
  // strict warning: Property subject / msgText has no initializer and is
  // not definitely assigned in the constructor.
  // no immediate remedy except not using strict Typescript for now. 

  // Angular: "Use this API as the last resort when direct access to DOM is needed. 
  // Use templating and data-binding provided by Angular instead."
  // https://angular.io/api/core/ElementRef

  // It may be better in future to make a proper form and use the clear 
  // method to wipe out old values after pressing submit.
  // or if the clear button is pressed.
  @ViewChild('subject', {static: true}) subject: ElementRef;
  @ViewChild('msgText',{static: true}) msgText: ElementRef;

  constructor (private messageService: MessageService) {}

  onSendMessage() {
    const id = this.messageService.getNextId();
    this.messageService.addMessage(new Message(
      id, 
      this.subject.nativeElement.value,
      this.msgText.nativeElement.value, 
      '0' // id of my contact
      ));
  }
  onClear() {
    this.subject.nativeElement.value = '';
    this.msgText.nativeElement.value = '';
  } 
}
