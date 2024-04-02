import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Contact } from '../contact.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
    private name: string = "";
    private admin = "";
    private id = "";
    loginStatusChangedEvent: Subject<string>= new Subject();

    setLoggedUser(name: string, id: string, admin: string) {
        localStorage.setItem("WDD433-CMS-id", id);
        localStorage.setItem("WDD433-CMS-name", name);
        localStorage.setItem("WDD433-CMS-admin", admin);
        this.loginStatusChangedEvent.next(this.id)
        this.id = id;
        this.name = name;
        this.admin = admin; 
    } 
    getLoggedName() {
        if (this.name) {
            return this.name;
        } else {
            return  localStorage.getItem("WDD433-CMS-name");
        }
    }
    getLoggedId() {
        if (this.id) {
            return this.id;
        } else {
            return  localStorage.getItem("WDD433-CMS-id");
        }
    }
    getLoggedAdmin() {
        if (this.admin) {
            return this.admin;
        } else {
            return  localStorage.getItem("WDD433-CMS-admin");
        }
    }
    logout() {
        localStorage.removeItem("WDD433-CMS-id");
        localStorage.removeItem("WDD433-CMS-name");
        localStorage.removeItem("WDD433-CMS-admin");
        this.id = "";
        this.name = "";
        this.admin = "";
        this.loginStatusChangedEvent.next("");
    }
}
