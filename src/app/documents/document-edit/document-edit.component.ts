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
    console.log('contact edit OnInit ');
    console.log('edit mode is '+this.editMode);
     this.subscription1 = this.route.params.subscribe(
       (params: Params) => {
        console.log('contact edit route changed?');
        console.log('edit mode is '+this.editMode);
         const id = params.id;
         if (!id) {
           this.editMode = false;
           console.log('it must not be edit mode');
           return;
         }
         console.log(id);
         this.editMode = true;
         console.log('looking for document '+id);
         this.document = this.documentService.getDocument(id);
         if (this.document === null) {
          console.log('it is supposed to be edit mode but where is the document?');
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

  onClearError() {
    this.errorMessage = "";
  }
}
