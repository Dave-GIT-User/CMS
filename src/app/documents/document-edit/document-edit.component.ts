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
    if (this.invalidForm(form)) {
      return;
    }
    const value = form.value;
    const id = this.editMode ? this.document.id : "0";
    const newDocument: Document = new Document(
      id,
      // scrape off leading and trailing whitespace.
      value.name.trim(),
      value.description.trim(),
      value.url.trim());
    if (this.editMode) {
      this.documentService.updateDocument(this.document, newDocument)
    } else {
      this.documentService.addDocument(newDocument);
    }
    this.router.navigate(['/documents']);
  }

  // defend against someone submitting a form with whitespace but no real content.
  invalidForm(form: NgForm) {
    const value = form.value;
    if (!value) {
      return true;
    }
    const name: string = value.name;
    const url: string = value.url;
    if (!value.name || !value.url) {
      return true;
    }
    return (value.name.trim().length == 0 || value.url.trim().length == 0);
  }

  ngOnInit() {

     this.subscription1 = this.route.params.subscribe(
       (params: Params) => {
         const id = params.id;
         if (!id) {
           this.editMode = false;
           return;
         }
         this.editMode = true;
         this.document = this.documentService.getDocument(id);
         if (this.document === null) {
           this.onCancel();
           return;
         }

       }
     );
     this.subscription2 =     this.subscription2 = this.documentService.documentIOError.subscribe(
       (error) => {
         this.errorMessage = error;
          }
     );  
   }
in
  onClearError() {
    this.errorMessage = "";
  }
}
