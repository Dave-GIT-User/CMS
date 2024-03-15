import { Component, Input } from '@angular/core';
import { Contact } from '../contact.model';
@Component({
  selector: 'cms-contact-item',
  templateUrl: './contact-item.component.html',
  styleUrl: './contact-item.component.css'
})
export class ContactItemComponent {
  @Input() contact: Contact;
  @Input() contactIndex: string = '1';

  // suppress highlighted appearance of subcontacts in edit mode
  activeStatus() : string {
    return (this.contactIndex === './') ? "active-link" : "active";
  }
}