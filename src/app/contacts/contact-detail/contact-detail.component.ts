import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service'
import { LoginService } from '../login/login.service';

@Component({
  selector: 'cms-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.css'
})

export class ContactDetailComponent implements OnInit{
  contact: Contact;
  id: string;
  group: Contact[] = [];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private contactService: ContactService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
        this.contact = this.contactService.getContact(this.id);
        if (this.contact === null) {
          this.router.navigate(['/contacts']);
          return;
        }
        if (this.contact.group) {
          this.group = this.contact.group
        } else {
          this.group = [];
        }
      }
    );
  }

  onDelete() {
    this.contactService.deleteContact(this.contact);
    this.router.navigate(['/contacts']);
  }
  canEdit() {
    const admin = this.loginService.getLoggedAdmin();
    // admin only edits contacts like "Network Team"
    return admin === '1' && +this.id > 99 && +this.id < 200;
  }

  canDelete () {
    const admin = this.loginService.getLoggedAdmin();
    return admin === '1' || (this.loginService.getLoggedId() == this.id);
  }  

  getName() {
    if (!this.contact) {
      this.router.navigate(['/contacts']);
      return "";     
    }
    return this.contact.name;
  }

  getImageUrl() {
    if (!this.contact) {
      this.router.navigate(['/contacts']);
      return "";     
    }
    return this.contact.imageUrl;
  }

  getEmail() {
    if (!this.contact) {
      this.router.navigate(['/contacts']);
      return "";     
    }
    return this.contact.email;
  }

  getPhone() {
    if (!this.contact) {
      this.router.navigate(['/contacts']);
      return "";     
    }
    return this.contact.phone;
  }
}
