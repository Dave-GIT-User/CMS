import { Injectable, EventEmitter } from '@angular/core';

import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private documents: Document[] = [];
  documentSelectedEvent: EventEmitter<Document>= new EventEmitter();

  constructor() { 
    this.documents = MOCKDOCUMENTS;
  }

  getDocuments(): Document[] {
    return this.documents.slice();
  }

    // week 5 note: This is not used.
    // Presumably we will use it in future.
    // search for a document with the expected id.
    /*getDocument(id: string): Document {
      // changed let document to const document
      // based on Lint complaint.
      for (const document of this.documents) {
        if (document.id === id)
          return document;
      }
      // how do we handle failure?
      return null; 
      // but now null must be intercepted if it happens...
    }*/
}
