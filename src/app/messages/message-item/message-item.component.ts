import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'app-message-item',
  templateUrl: './message-item.component.html',
  styleUrl: './message-item.component.css'
})
export class MessageItemComponent {
  @Output() selectedMessageEvent: EventEmitter<void>= new EventEmitter();
  @Input() message: Message;
  onSelected() {
    console.log('message-item says sender is '+this.message.sender);
    this.selectedMessageEvent.emit();
  }

}
