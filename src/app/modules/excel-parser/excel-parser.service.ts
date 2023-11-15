import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { Employee } from '../../types/employee';

@Injectable({
  providedIn: 'root',
})
export class ExcelParserService {

  parseExcel(file: File): Promise<Employee[]> {
    return new Promise((resolve, reject) => {
      const reader: FileReader = new FileReader();

      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        const data = <Employee[]>XLSX.utils.sheet_to_json(ws);
        resolve(data);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsBinaryString(file);
    });
  }
}
