import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Contact } from '../contact.model';
@Component({
  selector: 'cms-contact-item',
  templateUrl: './contact-item.component.html',
  styleUrl: './contact-item.component.css'
})
export class ContactItemComponent {

  @Output() selectedContactEvent: EventEmitter<void>= new EventEmitter();
  @Input() contact: Contact;
  onSelected() {
      this.selectedContactEvent.emit();
  }
}