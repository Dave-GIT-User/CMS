import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
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
    if (this.documentService.noDocuments()) {
      this.router.navigate(['/documents']);
    }
    this.route.params.subscribe(
      (params: Params) => {
        const id = params.id;
        if (id === null) {
          this.editMode = false;
          return;
        }
        this.document = JSON.parse(JSON.stringify(this.documentService.getDocument(id)));
        if (this.document === null) {
          return;
        }
        this.editMode = true;
        this.document = JSON.parse(JSON.stringify(this.document));
      }
    );
  }
}
