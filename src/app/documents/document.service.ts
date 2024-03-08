import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Document } from './document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private documents: Document[] = [];
  documentSelectedEvent: Subject<Document>= new Subject();
  documentListChangedEvent: Subject<Document[]>= new Subject();
  private maxDocumentId: number = 0;
  constructor(private http: HttpClient) {  }
  private dbUrl = 'https://wdd430-cms-e3d85-default-rtdb.firebaseio.com/documents.json'

  getDocuments(): Document[] {
   // return this.documents.slice();
    this.http.get(this.dbUrl)
    .subscribe({ 
      next: (documents: Document[]) => {
        {
          this.documents = documents;
          this.maxDocumentId = this.getMaxDocumentId();
          // sort the documents.
          // from sample code at  
          // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
          this.documents.sort((a, b) => {
            //compare function
            const nameA = a.name.toUpperCase(); // ignore upper and lowercase
            const nameB = b.name.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
          
            // names must be equal
            return 0;
          });
          
          let documentListClone: Document[] = this.documents.slice();
          this.documentListChangedEvent.next(documentListClone);
          console.log('document list has now been updated')
          this.maxDocumentId = this.getMaxDocumentId();
          return  documentListClone;
        }
      }, 
      // we could perhaps give the user some feedback.
      error: (error) => console.log(error)
    });
    return null;
  }
  noDocuments() {
    return this.documents.length  === 0;
  }
  storeDocuments() {
    console.log('commence storing documents');
    // may not be necessary since my verion has all string fields.
    // const documents = JSON.stringify(this.documents); 
    this.http.put<'application/json'>(this.dbUrl, this.documents)
    .subscribe({
      next: (responseData) => {
        console.log('StoreDocuments success '+responseData), 
        this.maxDocumentId = this.getMaxDocumentId();
        this.documentListChangedEvent.next(this.documents.slice());
      },
      // could / should also inform the user
      error: (error) => console.log('StoreRDocuments error '+error.value)
    })

  }

  getDocument(id: string): Document {
    console.log('searching for one document.'+id);
    for (const document of this.documents) {
      if (document.id === id)
      {
        return document;
      }
    }
    return null; 
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
    this.storeDocuments();
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
    this.storeDocuments(); 
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
    this.storeDocuments();
    return newDocument;
  }
}



