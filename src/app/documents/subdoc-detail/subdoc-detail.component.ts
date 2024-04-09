import { Component } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Document } from "../document.model";
import { DocumentService } from "../document.service";
import { WindRefService } from "../../wind-ref.service";
import { Contact } from "../../contacts/contact.model";
import { ContactService } from "../../contacts/contact.service";

// This is detail for a "subdocument"
// To avoid a rabbit hole of further changes and debugging,
// This is read only.
@Component({
  selector: "app-subdoc-detail",
  templateUrl: "./subdoc-detail.component.html",
  styleUrl: "./subdoc-detail.component.css",
})
export class SubdocDetailComponent {
  document: Document;
  id: string;
  children: Document[] = [];
  nativeWindow: any;

  constructor(
    private documentService: DocumentService,
    private route: ActivatedRoute,
    private windRefService: WindRefService,
    private router: Router,
    private contactService: ContactService
  ) {}

  ngOnInit(): void {
    this.nativeWindow = this.windRefService.getNativeWindow();
    this.route.params.subscribe((params: Params) => {
      this.id = params["id"];
      this.document = this.documentService.getDocument(this.id);
      if (this.document === null) {
        this.router.navigate(["/documents"]);
      } else {
        if (this.document.children) {
          this.children = this.document.children;
        } else {
          this.children = [];
        }
      }
    });
  }

  onView() {
    const url: string = this.document.url;
    this.nativeWindow.open(url);
  }

  getAuthor() {
    const authorId = this.document.author;
    if (authorId) {
      const author: Contact = this.contactService.getContact(authorId);
      if (author) {
        return author.name;
      } else return "anonymous";
    } else return "anonymous";
  }
}
