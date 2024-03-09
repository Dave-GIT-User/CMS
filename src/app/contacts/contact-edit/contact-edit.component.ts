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
        if (id === null) {
          this.editMode = false;
          return;
        }
        this.contact = JSON.parse(JSON.stringify(this.contactService.getContact(id)));
        if (this.contact === null) {
          return;
        }
        this.editMode = true;
        if (this.contact.group !== null) {
         this.groupContacts = JSON.parse(JSON.stringify(this.contact.group));
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
    const newContact: Contact = new Contact(
      value.id,
      value.name,
      value.email,
      value.phone,
      value.imageUrl, 
      this.groupContacts.slice());
    if (this.editMode) {
      this.contactService.updateContact(this.contact, newContact)
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

    // This pushes the new contact to the group.
    // this.groupContacts.push(contactCopy);

        
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

