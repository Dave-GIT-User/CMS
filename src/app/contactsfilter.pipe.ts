import { Pipe, PipeTransform } from "@angular/core";
import { Contact } from "./contacts/contact.model";

@Pipe({
  name: "contactsfilter",
})
export class ContactsfilterPipe implements PipeTransform {
  //transform(value: unknown, ...args: unknown[]): unknown {
  transform(contacts: Contact[], term: string): any {
    let filteredContacts: Contact[] = [];
    if (term && term.length > 0) {
      filteredContacts = contacts.filter((contact: Contact) =>
        contact.name.toLowerCase().includes(term.toLowerCase())
      );
    }
    if (filteredContacts.length < 1) {
      return contacts;
    }
    return filteredContacts;
  }
}
