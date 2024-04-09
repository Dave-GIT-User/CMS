import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";

import { Document } from "../document.model";
import { DocumentService } from "../document.service";
import {
  Router,
  ActivatedRoute,
  /* ActivatedRouteSnapshot,*/ Params,
} from "@angular/router";
import { LoginService } from "../../contacts/login/login.service";

@Component({
  selector: "app-subdoc-edit",
  templateUrl: "./subdoc-edit.component.html",
  styleUrl: "./subdoc-edit.component.css",
})
export class SubdocEditComponent implements OnInit {
  document: Document;
  childIndex: number = 0;
  //children: Document[] = [];
  child: Document;
  editMode: boolean = false;
  private subscription1: Subscription;
  private subscription2: Subscription;
  errorMessage = "";

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute,
    //private snapshot: ActivatedRouteSnapshot,
    private loginService: LoginService
  ) {}

  onCancel() {
    this.router.navigate(["/documents"]);
  }

  onSubmit(form: NgForm) {
    if (this.invalidForm(form)) {
      return;
    }
    if (!this.document) {
      this.onCancel();
      return;
    }
    const value = form.value;
    const id = this.editMode ? this.child.id : "0";
    const newChild: Document = new Document(
      id,
      this.loginService.getLoggedId(), // author
      // scrape off leading and trailing whitespace.
      value.name ? value.name.trim() : "",
      value.description ? value.description.trim() : "",
      value.url ? value.url.trim() : "",
      []
    ); //this.child.children ? this.child.children : []);
    if (this.editMode) {
      this.document.children[this.childIndex] = newChild;
    } else {
      this.document.children.push(newChild);
    }
    this.documentService.updateSubdocument(this.childIndex, this.document);

    this.router.navigate(["/documents"]);
  }

  getFormName() {
    if (this.editMode) return "Edit Child Document";
    else return "Add Child Document";
  }

  // defend against someone submitting a form with whitespace but no real content.
  invalidForm(form: NgForm) {
    const value = form.value;
    if (!value) {
      return true;
    }
    const name: string = value.name;
    const url: string = value.url;
    if (!value.name || !value.url) {
      return true;
    }
    return value.name.trim().length == 0 || value.url.trim().length == 0;
  }
  getParentId(index: number): number {
    const routeStr = this.route.toString();
    // like: route Route(url:'10/0/edit', path:':id/:id/edit')
    return +routeStr.substring(11).split("/")[0];
  }

  ngOnInit() {
    this.subscription1 = this.route.params.subscribe((params: Params) => {
      this.childIndex = params.id;
      this.editMode = this.childIndex > -1;
      const id = "" + this.getParentId(0);
      this.document = this.documentService.getDocument(id);
      if (!this.document) {
        this.onCancel();
        return;
      }
      if (this.editMode) {
        this.child = this.document.children[this.childIndex];
      }
    });
    this.subscription2 = this.subscription2 =
      this.documentService.documentIOError.subscribe((error) => {
        this.errorMessage = error;
      });
  }

  onClearError() {
    this.errorMessage = "";
  }
}
