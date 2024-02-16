import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DocumentsComponent } from './documents/documents.component';
import { ContactsComponent } from './contacts/contacts.component';
import { ContactEditComponent } from './contacts/contact-edit/contact-edit.component'; 
import { ContactDetailComponent } from './contacts/contact-detail/contact-detail.component';
import { MessagesComponent } from './messages/messages.component';
import { DocumentEditComponent } from './documents/document-edit/document-edit.component';
import { DocumentDetailComponent } from './documents/document-detail/document-detail.component';

const routes: Routes = [  
  { path: '', redirectTo: '/documents', pathMatch: 'full'},
  { path: 'documents', component: DocumentsComponent, children: [
    { path: 'new', component: DocumentEditComponent },
    { path: ':id', component: DocumentDetailComponent},
    { path: ':id/edit', component: DocumentEditComponent }
  ]},
  { path: 'messages', component: MessagesComponent},
  { path: 'contacts', component: ContactsComponent, children: [
    { path: 'new', component: ContactEditComponent },
    { path: ':id', component: ContactDetailComponent},
    { path: ':id/edit', component: ContactEditComponent}
  ]},
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ], 
  exports: [RouterModule],
})
export class AppRoutingModule { }

