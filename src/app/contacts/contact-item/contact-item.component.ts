import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Contact } from '../contact.model';
@Component({
  selector: 'app-contact-item',
  templateUrl: './contact-item.component.html',
  styleUrl: './contact-item.component.css'
})
export class ContactItemComponent {

  @Output() contactSelected: EventEmitter<void>= new EventEmitter();
  @Input() contact: Contact;
  onselected() {
    this.contactSelected.emit();
  }
}

/*import { Component } from '@angular/core';
import { Contact } from '../contact.model';

@Component({
  selector: 'app-contact-item',
  templateUrl: './contact-item.component.html',
  styleUrl: './contact-item.component.css'
})

export class ContactItemComponent {
  contacts: Contact[] = [];
 
  constructor() {
    this.contacts.push(new Contact(
      '1',
      'R. Kent Jackson', 
      'jacksonk@byui.edu', 
      '208-496-3771', 
      '../assets/images/jacksonk.jpg'));
      this.contacts.push(new Contact(
        '2',
        'Rex Barzee', 
        'barzeer@byui.edu', 
        '208-496-3768', 
        '../assets/images/barzeer.jpg', 
        null));
  }
}
*/