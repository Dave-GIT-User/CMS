import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrl: './contact-edit.component.css'
})

export class ContactEditComponent implements OnInit {
  contact: Contact;
  groupContacts: Contact[] = [];
  editMode: boolean = false;
  
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
    this.router.navigate(['/contacts']);
  }

  onRemoveItem(index: number) {
    if (index < 0 || index >= this.groupContacts.length) {
       return;
    }
    this.groupContacts.splice(index, 1);
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
    if (!newContact) {// newContact has no value
      return true;
    }
    if (this.contact && newContact.id === this.contact.id) {
      return true;
    }
    for (let i = 0; i < this.groupContacts.length; i++){
      if (newContact.id === this.groupContacts[i].id) {
        return true;
      }
    }
    return false;
  }
/*
  assumes drag and drop which is not working
  addToGroup($event: any) {
    const selectedContact: Contact = $event.dragData;
    const invalidGroupContact = this.isInvalidContact(selectedContact);
    if (invalidGroupContact){
       return;
    }
    this.groupContacts.push(selectedContact);
  }
  */

  addToGroup() {
    const selectedContact: Contact = new Contact(
      '3',
      'Lee Barney',
      'barneyl@byui.edu',
      '208-496-3767',
      '../../assets/images/barneyl.jpg',
    );
    const invalidGroupContact = this.isInvalidContact(selectedContact);
    if (invalidGroupContact){
       return;
    }
    this.groupContacts.push(selectedContact);
  }
}

