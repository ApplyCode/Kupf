import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddIncomingLettersComponent } from './add-incoming-letters/add-incoming-letters.component';
import { AddOutgoingLettersComponent } from './add-outgoing-letters/add-outgoing-letters.component';
import { ArchieveComponent } from './archieve/archieve.component';
import { IncomingLetterDetailsComponent } from './incoming-letter-details/incoming-letter-details.component';
import { OutgoingLetterDetailsComponent } from './outgoing-letter-details/outgoing-letter-details.component';
import { PrintLabelsComponent } from './print-labels/print-labels.component';

const routes: Routes = [
  { path: 'print-labels', component: PrintLabelsComponent },
  { path: 'archieve', component: ArchieveComponent },
  { path: 'add-outgoing-letter', component: AddOutgoingLettersComponent },
  { path: 'outgoing-letter-details', component: OutgoingLetterDetailsComponent },
  { path: 'add-incoming-letter', component: AddIncomingLettersComponent },
  { path: 'add-incoming-letter/:mytransid', component: AddIncomingLettersComponent },
  { path: 'incoming-letter-details', component: IncomingLetterDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunicationRoutingModule { }
