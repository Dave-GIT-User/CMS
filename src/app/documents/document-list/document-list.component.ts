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
