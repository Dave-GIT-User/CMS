import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { LoginService } from './login.service';

@Component({
  selector: 'cms-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {
contact: Contact = null;
error = false;
  
  constructor(
       private contactService: ContactService,
       private router: Router,
       private loginService: LoginService) {}
  
       ngOnInit(): void {
        this.contactService.getContacts();
      }  
  
  onCancel() {
    this.router.navigate(['/']);
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const hash = this.contactService.hashValue(value.name, value.password );
    this.contact = this.contactService.getContactByHash(value.name, hash);
    if (this.contact) {
      this.error = false;
      this.loginService.setLoggedUser(this.contact.name, this.contact.id, this.contact.admin);
      this.onCancel();
    }
    else {
      this.error = true;
    }
  }

  errorMessage() {
    if (this.error)
      return "Incorrect user name or password.";
    else 
      return "The Name and Password fields are required."
  }
}