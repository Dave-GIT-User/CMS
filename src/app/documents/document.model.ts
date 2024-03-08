export class Document {
	constructor(
		public id: string, 
		public name: string, 
		public description: string, 
		public url: string, 
		/*
		public children: {
			id: string, 
			name: string, 
			description: string, 
			url: string}[] = null) {
		*/
		public children: Document[] = null) {}
/*

id—the document id

name—the name of the document

description—a brief description of the document

url—the URL of where the file is located

children—a list of document objects that are related to the current document
*/
}
