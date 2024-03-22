import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Document } from '../document.model'
import { DocumentService } from '../document.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'cms-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrl: './document-edit.component.css'
})
export class DocumentEditComponent implements OnInit{
  document: Document;
  editMode: boolean = false;
  private subscription1: Subscription;
  private subscription2: Subscription;
  errorMessage = "";

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute) {
  }

  onCancel() {
    this.router.navigate(['/documents']);
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newDocument: Document = new Document(
      value.id,
      value.name,
      value.description,
      value.url);
    if (this.editMode) {
      this.documentService.updateDocument(this.document, newDocument)
    } else {
      this.documentService.addDocument(newDocument);
    }
    this.router.navigate(['/documents']);
  }

  ngOnInit() {
    this.subscription1 = this.route.params.subscribe(
      (params: Params) => {
        const id = params.id;
        if (id === null) {
          this.editMode = false;
          this.onCancel();
        }
        //this.document = JSON.parse(JSON.stringify(this.documentService.getDocument(id)));
        this.document = this.documentService.getDocument(id)        
        if (this.document === null) {
          this.onCancel();
        }
        this.editMode = true;
      }
    );
    this.subscription2 = this.subscription2 = this.documentService.documentIOError.subscribe(
      (error) => {
        this.errorMessage = error;
         }
    );  
  }

  onClearError() {
    this.errorMessage = "";
  }
}
