export class Contact {
    constructor (
        public id: string,
        public name: string,
        public email: string,
        public phone: string,
        public imageUrl: string,
        public group: Contact[] = null,
        public hash: string,
        public admin: string
    ) { }
        /*
        id—the id of the contact.

        name—the name of the contact.
        
        email—the email address of the contact.
        
        phone—the phone number of the contact.
        
        imageUrl—the URL of the photo image of the contact.
        
        group—this attribute is only applicable to group contacts. It is an array of other contacts that belong to the group.
        */
}