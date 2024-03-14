import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { WindRefService } from '../../wind-ref.service';

// This is detail for a "subdocument"
// To avoid a rabbit hole of further changes and debugging,
// This is read only.
@Component({
  selector: 'app-subdoc-detail',
  templateUrl: './subdoc-detail.component.html',
  styleUrl: './subdoc-detail.component.css'
})
export class SubdocDetailComponent {
  document: Document;
  id: string;
  children: Document[] = [];
  nativeWindow: any;

  constructor (
    private documentService: DocumentService, 
    private route: ActivatedRoute, 
    private windRefService: WindRefService,
    private router:Router) {}
    ngOnInit(): void {
      this.nativeWindow=this.windRefService.getNativeWindow();
      this.route.params.subscribe(
        (params: Params) => {
          console.log('subdoc details');
          this.id = params['id'];
          this.document = this.documentService.getDocument(this.id);
          if (this.document === null) {
            this.router.navigate(['/documents']);
          } else {
            if (this.document.children) {
              console.log('child documents found');
              this.children = this.document.children
            } else {
              console.log('no child documents found');
              this.children = [];
            }
          }
        }
      );
    }

  onView() {
    const url: string = this.document.url;
    this.nativeWindow.open(url);
  }
}

