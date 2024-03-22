import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service'

// This is detail for a "subcontact."
// To avoid a rabbit hole of further changes and debugging,
// This is read only.
@Component({
  selector: 'app-subcon-detail',
  templateUrl: './subcon-detail.component.html',
  styleUrl: './subcon-detail.component.css'
})
export class SubconDetailComponent {
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
}
