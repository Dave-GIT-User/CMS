import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private documents: Document[] = [];
  documentSelectedEvent: Subject<Document>= new Subject();
  documentListChangedEvent: Subject<Document[]>= new Subject();
  private maxDocumentId: number = 0;
  constructor() { 
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxDocumentId();
  }

  getDocuments(): Document[] {
    return this.documents.slice();
  }

  // week 5 note: This is not used.
  // Presumably we will use it in future.
  // search for a document with the expected id.
  getDocument(id: string): Document {
    // changed let document to{ const document
    // based on Lint complaint.
    for (const document of this.documents) {
      if (document.id === id)
      {
        return document;
      }
    }
    // how do we handle failure?
    return null; 
    // but now null must be intercepted if it happens...
  }
  deleteDocument(document: Document) {
    if (!document) {
       return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
       return;
    }
    this.documents.splice(pos, 1);
    this.documentListChangedEvent.next(this.documents.slice());
    // What if we deleted the last document?
    this.maxDocumentId = this.getMaxDocumentId();
  }

  private getMaxDocumentId(): number {
    let highest: number = 0;
    for (let document of this.documents) {
      if (+document.id > highest) {
        highest = +document.id;
      }
    }
    return highest;
  }

  addDocument(newDocument: Document ) {
    if (newDocument === null)
      return;
    this.maxDocumentId++;
    newDocument.id = ''+this.maxDocumentId;
    this.documents.push(newDocument);
    let documentListClone: Document[] = this.documents.slice();
    this.documentListChangedEvent.next(documentListClone);
  }

  updateDocument(originalDocument: Document, newDocument: Document): Document {
    if (newDocument === null)
      return null;
    const id: string = originalDocument.id;
    // look for the original document
    let i: number = 0;
    for (const document of this.documents) {
      if (document.id === id)
        break;
      i++;
    }
    // did we find it?
    if (i==this.documents.length) 
      return null;
    newDocument.id = id;
    this.documents[i] = newDocument;
    let documentListClone: Document[] = this.documents.slice();
    this.documentListChangedEvent.next(documentListClone);
    return newDocument;
  }
}



