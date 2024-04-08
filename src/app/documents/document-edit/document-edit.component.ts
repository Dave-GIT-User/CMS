import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Document } from '../document.model'
import { DocumentService } from '../document.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LoginService } from '../../contacts/login/login.service';

@Component({
  selector: 'cms-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrl: './document-edit.component.css'
})
export class DocumentEditComponent implements OnInit{
  document: Document;
  children: Document[] = [];
  editMode: boolean = false;
  private subscription1: Subscription;
  private subscription2: Subscription;
  errorMessage = "";

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute,
    private loginService: LoginService) {
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
      this.loginService.getLoggedId(),
      // scrape off leading and trailing whitespace.
      value.name ? value.name.trim() : "",
      value.description ? value.description.trim(): "",
      value.url ? value.url.trim() : "",
      this.editMode ? this.document.children : []);
    if (this.editMode) {
      this.documentService.updateDocument(newDocument)
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
        } else {
         if (this.document.children) {
           this.children = this.document.children
         } else {
           this.children = [];
         }
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

  onEditSubdocument(index: number) {
    this.router.navigate(['/documents/'+this.document.id+'/'+index+'/edit']);
  }

  onDeleteSubdocument(index: number) {
    this.document.children.splice(index, 1);
    this.documentService.updateSubdocument(index, this.document);
  }

  onAddSubdocument(form: NgForm) {
    // use nonexistent index of -1 to signal call for new child.
    this.router.navigate(['/documents/'+this.document.id+'/-1/edit']);
  }
}
