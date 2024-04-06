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
  constructor(private http: HttpClient) {  }

  //private dbUrl = 'http://localhost:3000';
  private dbUrl = 'https://cms-api-3t5r.onrender.com';
  getDocuments(): void {
    this.http.get(this.dbUrl+'/documents')
    .subscribe({ 
      next: (documentData: {message: string, documents: Document[]}) => {
          this.documents = documentData.documents;

          this.sortDocuments();
          
          let documentListClone: Document[] = this.documents.slice();
          this.documentListChangedEvent.next(documentListClone);
      }, 
      error: (error) => {
        this.documentIOError.next("Error fetching documents!");
        console.log(error);
      }
    });
  }
    sortDocuments() {
          // sort the documents by document name (alphabetically)
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
    this.http.delete(this.dbUrl+'/documents/'+id)
    .subscribe({
      next: (responseData) => {
        this.documentListChangedEvent.next(this.documents.slice());
      },
      error: (msg) => {
        this.documentIOError.next("Error deleting a document!");
        console.log('Delete document error '+msg.error);
      }
    })
   }

    deleteSubdocument(index: number, newDocument: Document) {
    // look for the the index into the array of the updated document
    const pos = this.documents.indexOf(newDocument);
    if (pos < 0) {
       return;
    }
    // did we find it?
    if (pos <0) {
      return;
    }
    this.http.put<'application/json'>(this.dbUrl+'/subdocuments/'+index, newDocument)
    .subscribe({
      next: (responseData) => {
        this.documents[pos].children.splice(index, 1);
        this.documentListChangedEvent.next(this.documents.slice());
      },
      error: (msg) => {
        this.documentIOError.next("Error deleting subdocument!");
        console.log('Delete subdocument error '+msg.error);
      }
    })
  }

  addDocument(newDocument: Document ) {
    if (newDocument === null)
      return;
    let documentListClone: Document[] = this.documents.slice();
    // now we will post just this record.
    this.http.post(this.dbUrl+'/documents/1', newDocument)
    .subscribe({
      next: (response: {statusMessage: string, document: Document}) => {
        this.documents.push(response.document);
        
        // this fixes a timing issue observed after adding a new message
        this.getDocuments();

        // Sort - otherwise, the new document tacks on the end,
        // but then positions alphabetically upon refresh or returning
        // from looking at messages or contacts.
        this.sortDocuments();
        this.documentListChangedEvent.next(this.documents.slice());
      },
      error: (msg) => {
        this.documentIOError.next("Error adding a document!");
        console.log('add document error '+msg.error);
      }
    })
  }

  updateDocument(newDocument: Document): Document {
    const id: string = newDocument.id;
    // look for the the index into the array of the updated document
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
    this.http.put<'application/json'>(this.dbUrl+'/documents/'+id, newDocument)
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



