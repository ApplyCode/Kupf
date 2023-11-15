import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExcelParserComponent } from './excel-parser.component';
import { ExcelParserService } from './excel-parser.service';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ExcelParserComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ExcelParserComponent,
      },
    ]),
  ],
  providers: [ExcelParserService],
})
export class ExcelParserModule {}
