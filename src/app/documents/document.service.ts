import { Injectable, EventEmitter } from '@angular/core';

import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private documents: Document[] = [];
  documentSelectedEvent: EventEmitter<Document>= new EventEmitter();
  documentChangedEvent: EventEmitter<Document[]>= new EventEmitter();
  constructor() { 
    this.documents = MOCKDOCUMENTS;
  }

  getDocuments(): Document[] {
    return this.documents.slice();
  }
  getDocumentByIndex(index: number) {
    return this.documents[index];
  }
  // week 5 note: This is not used.
  // Presumably we will use it in future.
  // search for a document with the expected id.
  getDocument(id: string): Document {
    // changed let document to{ const document
    // based on Lint complaint.
    console.log('docservice getDoc('+id+')')
    for (const document of this.documents) {
      if (document.id === id)
      {
        console.log('docsvc found doc about '+document.name);
        return document;
      }
    }
    console.log('docsvc did not find doc '+id);
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
    this.documentChangedEvent.emit(this.documents.slice());
 }
}
