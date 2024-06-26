import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { Contact } from "../contact.model";
import { ContactService } from "../contact.service";
import { MessageService } from "../../messages/message.service";
import { LoginService } from "../login/login.service";

@Component({
  selector: "cms-contact-list",
  templateUrl: "./contact-list.component.html",
  styleUrl: "./contact-list.component.css",
})
export class ContactListComponent implements OnInit, OnDestroy {
  term: string = "";
  contacts: Contact[] = [];
  errorMessage = "";
  subscription1: Subscription = new Subscription();
  subscription2: Subscription = new Subscription();

  isAdmin() {
    const admin = this.loginService.getLoggedAdmin();
    return admin === "1";
  }
  constructor(
    private contactService: ContactService,
    private messageService: MessageService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.contactService.getContacts();
    this.subscription1 = this.contactService.contactListChangedEvent.subscribe(
      (updatedcontacts: Contact[]) => {
        this.contacts = updatedcontacts;
      }
    );
    this.subscription2 = this.contactService.contactIOError.subscribe(
      (error) => {
        this.errorMessage = error;
      }
    );
  }

  onClearError() {
    this.errorMessage = "";
  }

  search(value: string) {
    this.term = value;
  }

  ngOnDestroy(): void {
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
  }
}
