import { Component, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'app-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrl: './message-edit.component.css'
})

export class MessageEditComponent {
  @Output() addMessageEvent: EventEmitter<Message>= new EventEmitter();
  @ViewChild('subject', {static: true}) subject: ElementRef;
  @ViewChild('msgText', {static: true}) msgText: ElementRef;
  id: string;
  currentSender: string = "David Hendricks"
  rndNum: number;
 
  onSendMessage() {
    this.rndNum = Math.floor(Math.random() * 1000);
    this.id=''+this.rndNum; // convert random number to string
    this.addMessageEvent.emit(new Message(
      this.id, 
      this.subject.nativeElement.value, 
      this.msgText.nativeElement.value, 
      this.currentSender));
      console.log('message-edit says sender is '+this.currentSender);
  }
  onClear() {
    // is this legal?
    this.subject.nativeElement.value = '';
    this.msgText.nativeElement.value = '';
  }
}
