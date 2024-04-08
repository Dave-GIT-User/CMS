import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DocumentsComponent } from './documents/documents.component';
import { ContactsComponent } from './contacts/contacts.component';
import { ContactEditComponent } from './contacts/contact-edit/contact-edit.component'; 
import { ContactDetailComponent } from './contacts/contact-detail/contact-detail.component';
import { MessagesComponent } from './messages/messages.component'; 
import { MessageEditComponent } from './messages/message-edit/message-edit.component';
import { MessageDetailComponent } from './messages/message-detail/message-detail.component';
import { DocumentEditComponent } from './documents/document-edit/document-edit.component';
import { DocumentDetailComponent } from './documents/document-detail/document-detail.component';
import { SubdocDetailComponent } from './documents/subdoc-detail/subdoc-detail.component';
import { SubdocEditComponent } from './documents/subdoc-edit/subdoc-edit.component';
import { SubconDetailComponent } from './contacts/subcon-detail/subcon-detail.component';
import { LoginComponent } from './contacts/login/login.component';
import { HelpComponent } from './help/help.component';

const routes: Routes = [  
  { path: '', redirectTo: '/documents', pathMatch: 'full'},
  { path: 'login', component: LoginComponent},
  { path: 'help', component: HelpComponent},
  { path: 'documents', component: DocumentsComponent, children: [
    { path: 'new', component: DocumentEditComponent },
    { path: ':id', component: DocumentDetailComponent},
    { path: ':id/edit', component: DocumentEditComponent },
    { path: ':id/:id', component: SubdocDetailComponent},
    { path: ':id/:id/edit', component: SubdocEditComponent}
  ]},
  { path: 'messages', component: MessagesComponent, children: [
    { path: 'new', component: MessageEditComponent },
    { path: ':id', component: MessageDetailComponent},
    { path: ':id/edit', component: MessageEditComponent}
  ]},
  { path: 'contacts', component: ContactsComponent, children: [
    { path: 'new', component: ContactEditComponent },
    { path: ':id', component: ContactDetailComponent},
    { path: ':id/edit', component: ContactEditComponent},
    { path: ':id/:id', component: SubconDetailComponent}
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

