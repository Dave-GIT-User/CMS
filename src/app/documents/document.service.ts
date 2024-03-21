import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Document } from './document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private documents: Document[] = [];
  //documentSelectedEvent: Subject<Document>= new Subject();
  documentListChangedEvent: Subject<Document[]>= new Subject();
  documentIOError: Subject<string>=new Subject();
  private maxDocumentId: number = 0;
  constructor(private http: HttpClient) {  }

  private dbUrl = 'http://localhost:3000/documents';
  getDocuments(): void {
    this.http.get(this.dbUrl)
    .subscribe({ 
      next: (documentData: {message: string, documents: Document[]}) => {
        console.log(documentData.message);
          this.documents = documentData.documents;
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
          this.maxDocumentId = this.getMaxDocumentId();
      }, 
      error: (error) => {
        this.documentIOError.next("Error fetching documents!");
        console.log(error);
      }
    });
  }

  noDocuments() {
    return this.documents.length  === 0;
  }

  getDocument(id: string): Document {
    for (const document of this.documents) {
      if (document.id === id) {
        return document;
      } else {
        if (document.children){
          for(const subDocument of document.children) {
            if (id === subDocument.id) {
              return subDocument;
            }
          }
        }
      }
    }
    return null; 
  }

  deleteDocument(document: Document) {
    if (!document) {
       return;
    }
    const id = document.id;
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
       return;
    }
    this.documents.splice(pos, 1);
    // use the more granular delete operation.
    this.http.delete<'application/json'>(this.dbUrl+'/'+id)
    .subscribe({
      next: (responseData) => {
        this.maxDocumentId = this.getMaxDocumentId();
        this.documentListChangedEvent.next(this.documents.slice());
      },
      error: (msg) => {
        this.documentIOError.next("Error deleting a document!");
        console.log('Delete document error '+msg.error);
      }
    })
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
    // now we will post just this record.
    this.http.post<'application/json'>(this.dbUrl+'/'+newDocument.id, newDocument)
    .subscribe({
      next: (responseData) => {
        this.maxDocumentId = this.getMaxDocumentId();
        this.documentListChangedEvent.next(this.documents.slice());
      },
      error: (msg) => {
        this.documentIOError.next("Error adding a document!");
        console.log('add document error '+msg.error);
      }
    })
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
    this.http.put<'application/json'>(this.dbUrl+'/'+id, newDocument)
    .subscribe({
      next: (responseData) => {
        this.documentListChangedEvent.next(this.documents.slice());
      },
      error: (msg) => {
        this.documentIOError.next("Error updating document!");
        console.log('Update document error '+msg.error);
      }
    })
    return newDocument;
  }
}



