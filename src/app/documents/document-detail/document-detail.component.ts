import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { WindRefService } from '../../wind-ref.service';

@Component({
  selector: 'cms-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrl: './document-detail.component.css'
})
export class DocumentDetailComponent implements OnInit {
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
          this.id = params['id'];
          this.document = this.documentService.getDocument(this.id);
          if (this.document === null) {
            this.router.navigate(['/documents']);
          } else {
            if (this.document.children) {
              this.children = this.document.children
            } else {
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
  onDelete() {
    this.documentService.deleteDocument(this.document);
    this.router.navigate(['/documents']);
  }
}
