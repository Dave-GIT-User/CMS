import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';


@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})
export class DocumentListComponent implements OnInit, OnDestroy {
  documents: Document[] = [];
  constructor(private documentService: DocumentService) {}
  private subscription: Subscription;
  ngOnInit(): void {
    this.documents = this.documentService.getDocuments();
    this.subscription = this.documentService.documentListChangedEvent.subscribe(
      (updatedDocuments: Document[]) => {
        this.documents=updatedDocuments;
         }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
