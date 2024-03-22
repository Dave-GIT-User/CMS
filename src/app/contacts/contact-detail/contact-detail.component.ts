import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service'

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
    private contactService: ContactService
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
        this.contact = this.contactService.getContact(this.id);
        if (this.contact === null) {
          this.router.navigate(['/contacts']);
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
}
