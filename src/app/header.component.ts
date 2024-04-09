import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

import { LoginService } from "./contacts/login/login.service";
import { ContactService } from "./contacts/contact.service";

@Component({
  selector: "cms-header",
  templateUrl: "./header.component.html",
  //styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(
    private loginService: LoginService,
    private contactService: ContactService,
    private router: Router
  ) {}
  //subscription: Subscription = new Subscription();

  logout() {
    this.loginService.logout();
  }

  editAccount() {
    this.contactService.getContacts();
    const id = this.loginService.getLoggedId();
    this.router.navigate(["contacts/" + id + "/edit"]);
  }

  getUserName() {
    //return this.name ? this.name : "User"
    return this.loginService.getLoggedName();
  }

  getPrompt() {
    const user = this.loginService.getLoggedName();
    return user ? user : "User";
  }
}
