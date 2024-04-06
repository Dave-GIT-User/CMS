/*
import { Component, Input } from '@angular/core';
import { Document } from '../document.model'

@Component({
  selector: 'cms-document-item',
  templateUrl: './document-item.component.html',
  styleUrl: './document-item.component.css'
})
export class DocumentItemComponent {
  @Input() document: Document;
  @Input() docIndex: string;
}
*/

import { Component, Input, OnInit } from '@angular/core';

import { Document } from '../document.model';
import { Contact } from '../../contacts/contact.model'
import { ContactService } from '../../contacts/contact.service';
import { Router } from '@angular/router';


@Component({
  selector: 'cms-document-item',
  templateUrl: './document-item.component.html',
  styleUrl: './document-item.component.css'
})
export class DocumentItemComponent implements OnInit{
  @Input() docIndex: string;
  @Input() document: Document; 
  documentAuthor: string = '';
  constructor(private contactService: ContactService,
    private router: Router) {}
  ngOnInit() {
    if (!this.document) {
      return;
    }
    if (!this.document.author) {
      this.documentAuthor = "anonymous"
      return;
    }
    const contact: Contact = this.contactService.getContact(this.document.author);
    if (contact) {
      this.documentAuthor = contact.name;
    }
  }

  getAuthor() {
    return this.documentAuthor ? this.documentAuthor: "anonymous";
  }
}
