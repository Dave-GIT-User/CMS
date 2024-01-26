export class Document {
	constructor(public id: string, public name: string, description: string, url: string, children: string) {}
/*

id—the document id

name—the name of the document

description—a brief description of the document

url—the URL of where the file is located

children—a list of document objects that are related to the current document
*/
}
