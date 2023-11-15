import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ImportDataComponent } from './import-data/import-data.component';
import { SharedModule } from '../../_sharedModule/SharedModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SearchTabModule } from '../_partials/search-tab.module';
import { MaterialModule } from '../../material/material.module';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatRadioModule} from '@angular/material/radio';

@NgModule({
  declarations: [
    ImportDataComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    BsDropdownModule,
    SearchTabModule,
    MaterialModule,
    NgSelectModule,
    MatRadioModule
  ]
})
export class ReportsModule { }
