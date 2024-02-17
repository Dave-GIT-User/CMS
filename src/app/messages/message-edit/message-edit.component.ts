import { Component} from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';


@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrl: './message-edit.component.css'
})

export class MessageEditComponent {


  // Angular: "Use this API as the last resort when direct access to DOM is needed. 
  // Use templating and data-binding provided by Angular instead."
  // https://angular.io/api/core/ElementRef
  // Corrected 2/17 by using event binding instead of ElementRef

  // strict warning: Property subject / msgText has no initializer and is
  // not definitely assigned in the constructor.
  // Corrected 2/17 by turning subject and msgText into normal class properties.
  //@ViewChild('subject', {static: true}) subject: ElementRef;
  //@ViewChild('msgText',{static: true}) msgText: ElementRef;
subject: string = '';
msgText: string = '';
oldSubject: string = '';
oldMsg: string = ''
  constructor (private messageService: MessageService) {}

  onSendMessage() {
    if (this.subject == this.oldSubject && this.msgText) {
      return; // key bounce, most likely.
    }
    this.oldSubject = this.subject;
    this.oldMsg = this.msgText;
    const id = this.messageService.getNextId();
    this.messageService.addMessage(new Message(
      id, 
      this.subject,
      this.msgText, 
      '0' // id of my contact
      ));
  }
  onUpdateSubject(event: Event) {
    this.subject = (event.target as HTMLInputElement).value;
  }
  onUpdateMessage(event: Event) {
    this.msgText = (event.target as HTMLInputElement).value;
  }
}
