import { Component, OnInit } from '@angular/core';
import { ExcelParserService } from './excel-parser.service';
import { Employee } from '../../types/employee';

@Component({
  selector: 'app-excel-parser',
  templateUrl: './excel-parser.component.html',
  styleUrls: ['./excel-parser.component.scss']
})
export class ExcelParserComponent implements OnInit {
  data: Employee[] = [];
  constructor(private excelParserService: ExcelParserService) {}

  ngOnInit(): void {
  }

  onFileChange(event: any) {
    const file: File = event.target.files[0];
    this.excelParserService.parseExcel(file).then(data => {
      this.data = data;
      console.log(data)
    }).catch(error => {
      console.error("Error reading the file:", error);
    });
  }
}