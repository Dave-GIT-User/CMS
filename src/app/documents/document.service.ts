import { DestroyRef, Injectable } from '@angular/core';
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

  private dbUrl = 'http://localhost:3000';
  //private dbUrl = 'https://cms-api-3t5r.onrender.com';
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

    // actually handles add, delete, and edit subdocument.
    // if the childIndex is negative, the API will treat it 
    // as new subdocument. 
    // If the children array is the same size as that of 
    // the old document it is an edit subdocument.
    // Otherwise, it is a delete.
    updateSubdocument(childIndex: number, parentDocument: Document) {
      const pos = this.documents.indexOf(parentDocument);
      if (pos < 0) {
        return;
      }
      // did we find it?
      if (pos <0) {
        return;
      }
      var operation = "";
      const destCount = this.documents[pos].children.length;
      const srcCount = parentDocument.children.length;
      if (srcCount > destCount) {
        operation = "adding";
      } else if (srcCount == destCount) {
        operation = "editing";
      } else {
        operation = "deleting"
      }
      this.http.post(this.dbUrl+'/subdocuments/'+(childIndex), parentDocument)
      .subscribe({
        next: (response: {statusMessage: string, feedback: number}) => {
          this.documents[pos] = parentDocument;
          this.documentListChangedEvent.next(this.documents.slice());
          if (operation == "add") {
            this.getDocuments();
          }
          this.documentListChangedEvent.next(this.documents.slice());
        },
        error: (msg) => {
          this.documentIOError.next("Error " + operation+ "subdocument!");
          console.log(operation + ' subdocument error '+msg.error);
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



