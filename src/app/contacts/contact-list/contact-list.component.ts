import { Component, Output, EventEmitter } from '@angular/core';
import { Contact } from '../contact.model'
@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css'
})
export class ContactListComponent {
// we could also initialize the array like we did in recipe.
//  recipes: Recipe[] = [
//    new Recipe('Salmon', 'Lovely seafood','./assets/images/Salmon_dinner.jpg'),
//    new Recipe('Oriental Salad', 'Traditional salad','./assets/images/Oriental_salad.jpg')
//  ];
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
  @Output() contactWasSelected: EventEmitter<Contact>= new EventEmitter();
  oncontactSelected(contact: Contact) {
    this.contactWasSelected.emit(contact);
  }
}

/*import { Component, Output, EventEmitter } from '@angular/core';
import { Contact } from '../contact.model';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css'
})

export class ContactListComponent {
  
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