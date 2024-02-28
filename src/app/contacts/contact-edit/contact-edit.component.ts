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
  originalContact: Contact;
  contact: Contact;
  groupContacts: Contact[] = [];
  editMode: boolean = false;
  id: string;
  
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
        this.originalContact = JSON.parse(JSON.stringify(this.contactService.getContact(id)));
        if (this.originalContact === null) {
          return;
        }
        this.editMode = true;
        this.contact = JSON.parse(JSON.stringify(this.originalContact));
        /*
           if the contact has a group then
              groupContacts = clone the contact’s group
           endif
        */
       if (this.contact.group !== null) {
          this.contact.group = JSON.parse(JSON.stringify(this.originalContact.group));
       }
      }
    );
  }  
  
  onCancel() {
    this.router.navigate(['/contacts']);
  }

  onRemoveItem(item: number){

  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newContact: Contact = new Contact(
      value.id,
      value.name,
      value.email,
      value.phone,
      value.imageUrl);
    if (this.editMode) {
      this.contactService.updateContact(this.originalContact, newContact)
    } else {
      this.contactService.addContact(newContact);
    }
    this.router.navigate(['/Contacts']);
  }

}
