import { Component } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})
export class DocumentListComponent {
  documents: Document[] = [
    new Document('Abe', 'Albacore', 'All the fish', '../../../assets/documents/abe.txt', null),
    new Document('Bob', 'Boxing', 'Boxing galore!', '../../../assets/documents/bob.txt', null)
  ]
}
