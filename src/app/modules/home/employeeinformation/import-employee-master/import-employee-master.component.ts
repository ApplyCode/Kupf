import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { FormTitleDt } from 'src/app/modules/models/formTitleDt';
import { FormTitleHd } from 'src/app/modules/models/formTitleHd';
import { LocalizationService } from 'src/app/modules/_services/localization.service';
import { EmployeeService } from 'src/app/modules/_services/employee.service';
import { AuthService } from 'src/app/modules/auth';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/modules/_services/common.service';
import { MatTableDataSource } from '@angular/material/table';

interface SampleFile {
  value: string;
  text: string;
}

@Component({
  selector: 'app-import-employee-master',
  templateUrl: './import-employee-master.component.html',
  styleUrls: ['./import-employee-master.component.scss']
})

export class ImportEmployeeMasterComponent implements OnInit {

  // /*********************/
  //  formHeaderLabels$ :Observable<FormTitleHd[]>; 
  //  formBodyLabels$ :Observable<FormTitleDt[]>; 
  //  formBodyLabels :FormTitleDt[]=[]; 
  //  id:string = '';
  //  languageId:any;
  //  // FormId to get form/App language
  //  @ViewChild('ImportEmployeeMaster') hidden:ElementRef;
  // /*********************/
  //#region 
  /*----------------------------------------------------*/

  // Language Type e.g. 1 = ENGLISH and 2 =  ARABIC
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
  file: File | null = null;
  sampleFileTypes: SampleFile[] = [];
  selectedSampleFile: string = '';
  tenantId: any;
  userName: any;
  isDisplay: boolean = false;
  isEdit: boolean = false;
  /*----------------------------------------------------*/
  //#endregion
  importData: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  columnsToDisplay: string[] = ['name', 'employeeId', 'periodCode', 'reference', 'previous_Amount', 'amount', 'actions'];

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService,
    public commonService: CommonService,
    private toastr: ToastrService,
  ) { }
  lang: string;
  periodCode: any;

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
    this.formId = 'ImportEmployeeMaster';

    // Check if LocalStorage is Not NULL
    if (localStorage.getItem('AppLabels') != null) {

      // Get data from LocalStorage
      this.AppFormLabels = JSON.parse(localStorage.getItem('AppLabels') || '{}');

      for (let labels of this.AppFormLabels) {

        if (labels.formID == this.formId && labels.language == this.languageType) {

          this.formHeaderLabels.push(labels);

          // this.formBodyLabels.push(labels.formTitleDTLanguage);
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

  editedId: number;
  editRow(val: boolean, id: number) {
    this.isEdit = val;
    this.editedId = id;
  }
  saveRow(val: boolean, id: number) {
    this.isEdit = val;
    this.editedId = id;
  }

  getImportDataDropdown() {
    this.employeeService.GetImportDataUploader(this.tenantId).subscribe((res: any) => {
      this.sampleFileTypes = res;
      console.log(this.sampleFileTypes);
    }, e=>{
      this.toastr.error("Something went wrong");
    })
  }
  getEmployeeImportServiceData(radioVal: number) {
    this.employeeService.getEmployeeImportServiceData(this.tenantId, this.periodCode, radioVal, this.selectedSampleFile).subscribe((res: any) => {
      this.importData = new MatTableDataSource<any>(res);
      if(res.length==0){
        this.toastr.warning("No data found");
      }
    }, e=>{
      this.toastr.error("Something went wrong");
    })
  }
  radioChange(val: any) {
    console.log(val.value)
    this.getEmployeeImportServiceData(val.value);
  }
  getSelectedValue(val: any) {
    this.selectedSampleFile = val;
  }

  onOpenCalendar(container: any) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
  }
  submitImportGrid() {
    var gridValue = {
      importEmployeeServiceMDLs: this.importData.filteredData,
      tenantId: this.tenantId,
      loginUserName: this.userName
    }
    this.employeeService.AddEmployeeServiceData(gridValue).subscribe((res: any) => {
      if (res.result > 0) {
        this.toastr.success(res.message);
        this.getEmployeeImportServiceData(0);
      } else {
        this.toastr.warning(res.message);
      }

    },
      e => {
        this.toastr.error("Something went wrong")
      })
  }

  draftImportGrid() {
    var gridValue = {
      importEmployeeServiceMDLs: this.importData.filteredData,
      tenantId: this.tenantId,
      loginUserName: this.userName
    }
    this.employeeService.EmployeeServiceDataDraftSubmit(gridValue).subscribe((res: any) => {
      if (res.result > 0) {
        this.toastr.success(res.message);
        this.getEmployeeImportServiceData(0);
      } else {
        this.toastr.warning(res.message);
      }
    },
      e => {
        this.toastr.error("Something went wrong")
      })
  }

  cancelImportGrid() {
    var gridValue = {
      importEmployeeServiceMDLs: this.importData.filteredData,
      tenantId: this.tenantId,
      loginUserName: this.userName
    }
    this.employeeService.DeletEmployeeImportServiceData(gridValue).subscribe((res: any) => {
      if (res.result > 0) {
        this.toastr.success(res.message);
        this.getEmployeeImportServiceData(0);
      } else {
        this.toastr.warning(res.message);
      }
    },
      e => {
        this.toastr.error("Something went wrong")
      })
  }
  onFileChange(files: FileList): void {
    const tempFile = files.item(0) || null;
    if (tempFile && this.isExcelFile(tempFile.name)) {
      this.file = tempFile;
    } else {
      this.toastr.warning('Invalid file type. Only XLSX, XLS, and CSV files are allowed.');
    }
  }
  isExcelFile(fileName: string): boolean {
    return /\.(xlsx|xls|csv)$/i.test(fileName);
  }
  downloadFile(): void {
    // Send a GET request to the server to download the file
    if (this.selectedSampleFile !== '') {

      this.employeeService.DownloadSampleFile(this.selectedSampleFile).subscribe((response: any) => {
        // Create a URL for the response blob
        const url = URL.createObjectURL(response);

        // Create a link element and click it to trigger the download
        const link = document.createElement('a');
        link.href = url;
        link.download = this.selectedSampleFile;
        link.click();

        // Release the URL object
        URL.revokeObjectURL(url);
      });
    } else {
      this.toastr.warning("Kindly select Uploader Type, before click on download");
    }
  }
  uploadEmployeeExcelFile(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser && this.file) {
      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('tenantId', this.tenantId);
      formData.append('username', this.userName);
      formData.append('UploaderName', this.selectedSampleFile);
      formData.append('PeriodCode', this.periodCode);
      this.employeeService.UploadEmployeeExcelFile(formData).subscribe(
        (response: any) => {
          this.toastr.success(response.message);
          this.isDisplay = true;
          this.getEmployeeImportServiceData(0);
        }),
        (error: any) => {
          this.toastr.error("Something went wrong");
        }
    } else {
      this.toastr.warning('Invalid file or user information')
    }
  }
}
