import { Component, Output, EventEmitter } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})
export class DocumentListComponent {
  //  @Output() itemSelected: EventEmitter<string>= new EventEmitter();
  @Output() selectedDocumentEvent: EventEmitter<Document>= new EventEmitter();
  documents: Document[] = [
    new Document('Abe', 'Albacore', 'All the fish...', '../../../assets/documents/abe.txt', null),
    new Document('Bob', 'Boxing', 'Boxing galore!', '../../../assets/documents/bob.txt', null),
    new Document('Cal', 'Club USA', 'Clubs are everywhere!', '../../../assets/documents/cal.txt', null),
    new Document('Dot', 'Dog Walking', 'Teach your dog to heel!', '../../../assets/documents/dot.txt', null)
  ]

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
    console.log('DocumentListComponent.onSelectedDocument');
  }
}
