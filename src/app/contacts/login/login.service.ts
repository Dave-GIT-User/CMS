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
    private date: string = "";

    setLoggedUser(name: string, id: string, admin: string, date: string) {
        localStorage.setItem("WDD433-CMS-id", id);
        localStorage.setItem("WDD433-CMS-name", name);
        localStorage.setItem("WDD433-CMS-admin", admin);
        localStorage.setItem("WDD433-CMS-date", date);

        this.id = id;
        this.name = name;
        this.admin = admin;
        this.date = date; 
    } 

    getLoggedName() {
        if (!this.isToday()) {
            this.logout();
        }
        if (this.name) {
            return this.name;
        } else {
            return  localStorage.getItem("WDD433-CMS-name");
        }
    }

    getLoggedId() {
        if (!this.isToday()) {
            this.logout();
        }
        if (this.id) {
            return this.id;
        } else {
            return  localStorage.getItem("WDD433-CMS-id");
        }
    }

    getLoggedAdmin() {
        if (!this.isToday()) {
            this.logout();
        }
        if (this.admin) {
            return this.admin;
        } else {
            return  localStorage.getItem("WDD433-CMS-admin");
        }
    }

    isToday(): boolean { // is there a saved date, and is it today?
        const storedDate = localStorage.getItem("WDD433-CMS-date")
        return (storedDate && storedDate == new Date().toString().substring(0,15))
    }

    logout() {
        localStorage.removeItem("WDD433-CMS-id");
        localStorage.removeItem("WDD433-CMS-name");
        localStorage.removeItem("WDD433-CMS-admin");
        localStorage.removeItem("WDD433-CMS-date");
        this.id = "";
        this.name = "";
        this.admin = "";
        this.date = "";
    }
}
