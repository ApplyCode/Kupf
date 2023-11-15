import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/modules/_services/common.service';
import { EmployeeService } from 'src/app/modules/_services/employee.service';
import { FormTitleHd } from 'src/app/modules/models/formTitleHd';


interface SampleFile {
  value: string;
  text: string;
}

@Component({
  selector: 'app-import-data',
  templateUrl: './import-data.component.html',
  styleUrls: ['./import-data.component.scss']
})
export class ImportDataComponent implements OnInit {
  lang: string;
  tenantId: any;
  userName: any;
  periodCode:any;
  languageType: any;

  // Selected Language
  language: any;

  // We will get form lables from lcale storage and will put into array.
  AppFormLabels: FormTitleHd[] = [];

  // We will filter form header labels array
  formHeaderLabels: any[] = [];

  // We will filter form body labels array
  formBodyLabels: any[] = [];

  // FormId
  formId: string;
  selectedFilterData:any;

  importData:MatTableDataSource<any> = new MatTableDataSource<any>([]);
  columnsToDisplay: string[] = ['name', 'employeeId', 'periodCode', 'reference', 'previous_Amount', 'amount', 'actions'];
  isEdit:boolean=false;
  sampleFileTypes: SampleFile[] = [];
  selectedSampleFile: string = '';

  constructor(
    private employeeService: EmployeeService,
    public commonService: CommonService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.tenantId = JSON.parse(localStorage.getItem('user') || '{}')[0].tenantId;
    this.userName = JSON.parse(localStorage.getItem('user') || '{}')[0].username;
    this.periodCode = JSON.parse(localStorage.getItem('user') || '{}')[0].periodCode;
    
    //#region TO SETUP THE FORM LOCALIZATION    
    // TO GET THE LANGUAGE ID e.g. 1 = ENGLISH and 2 =  ARABIC
    this.commonService.getLang().subscribe((lang: string) => {
      this.lang = lang;
    })
    this.languageType = localStorage.getItem('langType');

    // To get the selected language...
    this.language = localStorage.getItem('lang');

    // To setup the form id so will will get form labels based on form Id
    this.formId = 'ImportDataReprt';

    // Check if LocalStorage is Not NULL
    if (localStorage.getItem('AppLabels') != null) {

      // Get data from LocalStorage
      this.AppFormLabels = JSON.parse(localStorage.getItem('AppLabels') || '{}');

      for (let labels of this.AppFormLabels) {

        if (labels.formID == this.formId && labels.language == this.languageType) {
          this.formHeaderLabels.push(labels);
          const jsonFormTitleDTLanguage = labels.formTitleDTLanguage.reduce((result: any, element) => {
            result[element.labelId] = element;
            return result;
          }, {})
          this.formBodyLabels.push(jsonFormTitleDTLanguage);
        }
      }
      console.log(this.formBodyLabels);
    }
    //#endregion

    this.getImportDataDropdown();
  }

  
  editedId:number;
  editRow(val:boolean, id:number){
    this.isEdit =val;
    this.editedId = id;
  }
  saveRow(val:boolean, id:number){
    this.isEdit=val;
    this.editedId = id;
  }

  getImportDataDropdown() {
    this.employeeService.GetImportDataUploader(this.tenantId).subscribe((res: any) => {
      this.sampleFileTypes = res;
      console.log(this.sampleFileTypes);
    })
  }
  getSelectedValue(val: any) {
    this.selectedSampleFile = val;
    this.getEmployeeImportServiceData(val, 0)
  }
  radioChange(val:any){
    console.log(val.value)
    this.getEmployeeImportServiceData(this.selectedSampleFile, val.value);
  }
  getEmployeeImportServiceData(sampleFile:string, val:number){
    this.employeeService.getEmployeeImportServiceData(this.tenantId, this.periodCode, val, sampleFile).subscribe((res: any) => {
      this.importData = new MatTableDataSource<any>(res);
    })
  }


  onOpenCalendar(container: any) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
  }
  submitImportGrid(){
    var gridValue ={
      importEmployeeServiceMDLs :this.importData.filteredData,
      tenantId: this.tenantId,
      loginUserName: this.userName
    }
    this.employeeService.AddEmployeeServiceData(gridValue).subscribe((res:any)=>{
      if (res.result>0) {
        this.toastr.success(res.message);
      this.getEmployeeImportServiceData(this.selectedSampleFile, 0);
      }else{
        this.toastr.warning(res.message);
      }
      
    },
    e=>{
      this.toastr.error("Something went wrong")
    })
  }

  draftImportGrid(){
    var gridValue ={
      importEmployeeServiceMDLs :this.importData.filteredData,
      tenantId: this.tenantId,
      loginUserName: this.userName
    }
    this.employeeService.EmployeeServiceDataDraftSubmit(gridValue).subscribe((res:any)=>{
      if (res.result>0) {
        this.toastr.success(res.message);
      this.getEmployeeImportServiceData(this.selectedSampleFile, 0);
      }else{
        this.toastr.warning(res.message);
      }
    },
    e=>{
      this.toastr.error("Something went wrong")
    })
  }
  
  cancelImportGrid(){
    var gridValue ={
      importEmployeeServiceMDLs :this.importData.filteredData,
      tenantId: this.tenantId,
      loginUserName: this.userName
    }
    this.employeeService.DeletEmployeeImportServiceData(gridValue).subscribe((res:any)=>{
      if (res.result>0) {
        this.toastr.success(res.message);
      this.getEmployeeImportServiceData( this.selectedSampleFile,0);
      }else{
        this.toastr.warning(res.message);
      }
    },
    e=>{
      this.toastr.error("Something went wrong")
    })
  }

}
