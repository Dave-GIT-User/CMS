import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { ContactService } from '../../contacts/contact.service';
import { Contact } from '../../contacts/contact.model';
import { LoginService } from '../../contacts/login/login.service';


@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})
export class DocumentListComponent implements OnInit, OnDestroy {
  documents: Document[] = [];
  errorMessage = "";
  errorContacts = "";
  subscription1: Subscription = new Subscription();
  subscription2: Subscription = new Subscription();
  subscription3: Subscription = new Subscription();
  subscription4: Subscription = new Subscription();

  constructor(
    private documentService: DocumentService,
    private contactService: ContactService,
    private loginService: LoginService) {}

    ngOnInit(): void {
      this.contactService.getContacts();

      this.subscription1 = this.contactService.contactListChangedEvent.subscribe(
        (contacts: Contact[]) => {
          // we don't need to use contacts here, but it would be nice 
          // to confirm they are available.
          this.documentService.getDocuments();
           }
      );
      this.subscription2 = this.documentService.documentListChangedEvent.subscribe(
        (updateddocuments: Document[]) => {
          this.documents=updateddocuments;
           }
      );
      // check for errors fetching contacts
      this.subscription3 = this.contactService.contactIOError.subscribe(
        (error) => {
          this.errorContacts = error;
           }
      );
      // check for errors fetching documents
      this.subscription4 = this.documentService.documentIOError.subscribe(
        (error) => {
          this.errorMessage = error;
           }
      );
    }

    loggedIn() {
      const id = this.loginService.getLoggedId()
      return (id) && (id.length > 0)
    }
    
  onClearError() {
    this.errorContacts = "";
    this.errorMessage = "";
  }

  ngOnDestroy(): void {
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
    this.subscription3.unsubscribe();
    this.subscription4.unsubscribe();
  }
}
/*
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { LoginService } from '../../contacts/login/login.service';


@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})
export class DocumentListComponent implements OnInit, OnDestroy {
  documents: Document[] = [];
  errorMessage = "";
  constructor(private documentService: DocumentService,
    private loginService: LoginService) {}
  subscription1: Subscription = new Subscription();
  subscription2: Subscription = new Subscription();
  
  ngOnInit(): void {
    this.documentService.getDocuments();
    this.subscription1 = this.documentService.documentListChangedEvent.subscribe(
      (updatedDocuments: Document[]) => {
        this.documents=updatedDocuments;
         }
    );
    this.subscription2 = this.documentService.documentIOError.subscribe(
      (error) => {
        this.errorMessage = error;
         }
    );
  }

  loggedIn() {
    const id = this.loginService.getLoggedId();
    return (id) && (id.length > 0);
  }

  onClearError() {
    this.errorMessage = "";
  }

  ngOnDestroy(): void {
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
  }
}
*/