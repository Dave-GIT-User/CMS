import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import {
  CdkDragDrop,
  moveItemInArray,
  copyArrayItem,
} from '@angular/cdk/drag-drop';
import { group } from '@angular/animations';
import { ContactsComponent } from '../contacts.component';


@Component({
  selector: 'cms-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrl: './contact-edit.component.css'
})

export class ContactEditComponent implements OnInit {
  contact: Contact;
  groupContacts: Contact[] = [];
  editMode: boolean = false;
  droppedContacts: Contact[] = [];
  invalidDrop: boolean = false;
  
  constructor(
       private contactService: ContactService,
       private router: Router,
       private route: ActivatedRoute) {}
  
       ngOnInit(): void {
        this.route.params.subscribe(
          (params: Params) => {
            const id = params.id;
            if (!id) {
              this.editMode = false;
              return;
            }
            this.contact = this.contactService.getContact(id);
            if (this.contact === null) {
              this.onCancel();
              return;
            }
            this.editMode = true;
            if (this.contact.group !== null) {
             this.groupContacts = this.contact.group;
            }
          }
        );
      }  
  
  onCancel() {
    this.invalidDrop = false;
    this.router.navigate(['/contacts']);
  }

  onRemoveItem(index: number) {
    if (index < 0 || index >= this.groupContacts.length) {
       return;
    }
    this.groupContacts.splice(index, 1);
    this.invalidDrop = false;
 }

  onSubmit(form: NgForm) {
    const value = form.value;
    const hash = this.editMode ? this.contact.hash : this.contactService.hashValue(value.name, 'ByuIdaho');
    const admin = this.editMode ? this.contact.admin : '0'; // do not provide a way to become an admin right now.
    const group = (this.groupContacts && this.groupContacts.length > 0) ? this.groupContacts.slice() : [];
    const id = this.editMode ? this.contact.id : '1';
    const newContact: Contact = new Contact(
      id,
      value.name,
      value.email,
      value.phone,
      value.imageUrl, 
      group,
      hash,
      admin);
    if (this.editMode) {
      this.contactService.updateContact(newContact)
    } else {
      this.contactService.addContact(newContact);
    }
    this.onCancel();
  }
  
  isInvalidContact(newContact: Contact) {
    // newContact has no value
    if (!newContact) {
      this.invalidDrop = true;
      return true;
    }
    if (this.contact && newContact.id === this.contact.id) {
      this.invalidDrop = true;
      return true;
    }
    if (this.groupContacts.length > 0) {
      for (let i = 0; i < this.groupContacts.length; i++){
        if (newContact.id === this.groupContacts[i].id) {
          this.invalidDrop = true;
          return true;
        }
      }
    }
    this.invalidDrop = false;
    return false;
  }

  // It would be great to insert the new contact where the user dropped it,
  // but event.currentIndex is incorrect, always 0 for some reason.
  // There is no time to debug this one.
  addToGroup(event: CdkDragDrop<Contact[]>) {
    const contactCopy = event.previousContainer.data.at(event.previousIndex);
    if (this.isInvalidContact(contactCopy)) {
      return;
    }
   
    // This, recommended by CDK, inserts the new contact at element 0,
    // but only because it obtains the wrong index at the drop zone.
    copyArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    )    
  }
}

