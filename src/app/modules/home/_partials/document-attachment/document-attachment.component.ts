import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { SelectServiceTypeDto } from 'src/app/modules/models/ServiceSetup/SelectServiceTypeDto';
import { DbCommonService } from 'src/app/modules/_services/db-common.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { JsonPipe } from '@angular/common';
import * as moment from 'moment';
import { FormTitleHd } from 'src/app/modules/models/formTitleHd';
import { CommonService } from 'src/app/modules/_services/common.service';
export interface Fruit {
  name: string;
}

@Component({
  selector: 'app-document-attachment',
  templateUrl: './document-attachment.component.html',
  styleUrls: ['./document-attachment.component.scss']
})
export class DocumentAttachmentComponent implements OnInit {
  @Input() parentFormGroup: FormGroup;
  @Input() documentAccordialDetails: string;
  documentAttachmentForm: FormArray<any>;
  selectDocTypeDto: any;

  addOnBlur = true;
  visible = true;
  selectable = true;
  removable = true;

  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  metaTag: string[] = [];
  allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  // We will get form lables from lcale storage and will put into array.
  AppFormLabels: FormTitleHd[] = [];

  // We will filter form header labels array
  formHeaderLabels: any[] = [];

  // We will filter form body labels array
  formBodyLabels: any = {
    en: {},
    ar: {}
  };
  formId: string;

  formTitle: string;
  lang: string;
  languageType: any;

  // Selected Language
  language: any;
  
  getForm!: FormGroup;
  @ViewChild('fruitInput', { static: false }) fruitInput!: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete!: MatAutocomplete;

  constructor(private fb: FormBuilder,
    public common: CommonService,
    private dbCommonService: DbCommonService) {
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._filter(fruit) : this.allFruits.slice()));
  }

  ngOnInit(): void {
    //
    this.getFormdvalue();
    //
    this.GetDocType();

    this.common.getLang().subscribe((lang: string) => {
      this.lang = lang
    })
    //#region TO SETUP THE FORM LOCALIZATION    
    // TO GET THE LANGUAGE ID e.g. 1 = ENGLISH and 2 =  ARABIC
    this.languageType = localStorage.getItem('langType');

    // To get the selected language...
    this.language = localStorage.getItem('lang');


    this.formId = 'AddService';
    

    // Check if LocalStorage is Not NULL
    if (localStorage.getItem('AppLabels') != null) {

      // Get data from LocalStorage
      this.AppFormLabels = JSON.parse(localStorage.getItem('AppLabels') || '{}');

      for (let labels of this.AppFormLabels) {

        if (labels.formID == this.formId) {

          const jsonFormTitleDTLanguage = labels.formTitleDTLanguage.reduce((result: any, element) => {
            result[element.labelId] = element;
            return result;
          }, {})
          if(labels.language == 1 ) {
            this.formBodyLabels['en'] = jsonFormTitleDTLanguage;
          } else if (labels.language == 2) {
            this.formBodyLabels['ar'] = jsonFormTitleDTLanguage;
          }
          // this.formBodyLabels.push(jsonFormTitleDTLanguage);
          console.log(this.formHeaderLabels)
          console.log(this.formBodyLabels);

        }
      }
    }

  }
  GetDocType() {
    this.dbCommonService.GetDocTypes(21).subscribe((response: any) => {
      console.log(response);
      this.selectDocTypeDto = response;
    }, error => {
      console.log(error);
    });
  }

  applicationSelectFile: any;
  onTheApplicationSelect(event: any) {
    if (event.target.files.length > 0) {
      const file: File = event.target.files[0];
      this.getForm?.get('appplicationFileDocument')?.setValue(file);
      this.applicationSelectFile = file.name;
    }
  }
  personPhotofile: any;
  onPersonalPhotoSelect(event: any) {
    if (event.target.files.length > 0) {
      const file: File = event.target.files[0];
      this.getForm?.get('personalPhotoDocument')?.setValue(file);
      this.personPhotofile = file.name;

    }
  }
  workIdfile: any;
  onWorkIdSelect(event: any) {
    if (event.target.files.length > 0) {
      const file: File = event.target.files[0];
      this.getForm?.get('workIdDocument')?.setValue(file);
      this.workIdfile = file.name;
    }
  }
  civilIdfile: any;
  onCivilIdSelect(event: any) {
    if (event.target.files.length > 0) {
      const file: File = event.target.files[0];
      this.getForm?.get('civilIdDocument')?.setValue(file);
      this.civilIdfile = file.name;
    }
  }
  salarydateFile: any;
  onSalaryDataSelect(event: any) {
    if (event.target.files.length > 0) {
      const file: File = event.target.files[0];
      this.getForm?.get('salaryDataDocument')?.setValue(file);
      this.salarydateFile = file.name;
    }
  }
  // Initialize form
  metatagarr: any;
  add(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our fruit

      if ((value || '').trim()) {
        this.metaTag.push(value.trim());
        JSON.stringify(this.metaTag);
      }
      // Reset the input value
      if (input) {
        input.value = '';
      }
      this.fruitCtrl.setValue(null);
    }
  }

  remove(fruit: string): void {
    const index = this.metaTag.indexOf(fruit);
    if (index >= 0) {
      this.metaTag.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.metaTag.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allFruits.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }


  getFormdvalue() {
    this.getForm = this.fb.group({
      subject: ['', Validators.required],
      attachmentRemarks: ['', Validators.required],

      appplicationFileDocType: ['', Validators.required],
      appplicationFileDocument: ['', Validators.required],

      civilIdDocType: ['', Validators.required],
      civilIdDocument: ['', Validators.required],

      workIdDocType: ['', Validators.required],
      workIdDocument: ['', Validators.required],

      personalPhotoDocType: ['', Validators.required],
      personalPhotoDocument: ['', Validators.required],

      salaryDataDocType: ['', Validators.required],
      salaryDataDocument: ['', Validators.required],
      mtag: ['', Validators.required],
      attachId: [''],
      createdDate: ['']
    })
  }

  value:any;
  setValueofDocForm(res: any) {
    console.log(res);
    this.value= res.transactionHDDMSDtos;
    let val = res.transactionHDDMSDtos;
    this.applicationSelectFile = val[0].attachmentByName;
    this.personPhotofile = val[1].attachmentByName;
    this.workIdfile = val[2].attachmentByName;
    this.civilIdfile = val[3].attachmentByName;
    this.salarydateFile = val[4].attachmentByName;
    this.metaTag = (val[0].metaTags).split(',');
    this.getForm.controls['subject'].setValue(val[0].subject);
    this.getForm.controls['attachmentRemarks'].setValue(val[0].remarks);
    this.getForm.controls['attachId'].setValue(val[0].attachId);
    this.getForm.controls['createdDate'].setValue(moment(val[0].createdDate).format("DD-MM-yyyy"));
    //
    this.getForm.controls['appplicationFileDocType'].setValue(val[0].documentType);
    this.getForm.controls['civilIdDocType'].setValue(val[1].documentType);
    this.getForm.controls['workIdDocType'].setValue(val[2].documentType);
    this.getForm.controls['personalPhotoDocType'].setValue(val[3].documentType);
    this.getForm.controls['salaryDataDocType'].setValue(val[4].documentType);
    this.convertTofile();
    //   
  }

  file0:any;
  file1:any;
  file2:any;
  file3:any;
  file4:any;
 convertTofile(){
  // console.log((this.value[0].attachmentByName).substring(this.value[0].attachmentByName.lastIndexOf(".") , this.value[0].attachmentByName.length));
  // this.file0 = new File([this.value[0].attachment], this.value[0].attachmentByName,{type : (this.value[0].attachmentByName).substring(this.value[0].attachmentByName.lastIndexOf("."), this.value[0].attachmentByName.length)});
  // this.file1 = new File([this.value[1].attachment], this.value[1].attachmentByName, {type : (this.value[1].attachmentByName).substring(this.value[1].attachmentByName.lastIndexOf("."), this.value[1].attachmentByName.length)});
  // this.file2 = new File([this.value[2].attachment], this.value[2].attachmentByName, {type : (this.value[2].attachmentByName).substring(this.value[2].attachmentByName.lastIndexOf("."), this.value[2].attachmentByName.length)});
  // this.file3 = new File([this.value[3].attachment], this.value[3].attachmentByName, {type : (this.value[3].attachmentByName).substring(this.value[3].attachmentByName.lastIndexOf("."), this.value[3].attachmentByName.length)});
  // this.file4 = new File([this.value[4].attachment], this.value[4].attachmentByName, {type : (this.value[4].attachmentByName).substring(this.value[4].attachmentByName.lastIndexOf("."), this.value[4].attachmentByName.length)});
  this.file0 = [this.value[0].attachment];
  this.file1 = [this.value[1].attachment];
  this.file2 = [this.value[2].attachment];
  this.file3 = [this.value[3].attachment];
  this.file4 = [this.value[4].attachment];
}

  formVal() {
    this.getForm.controls['mtag'].setValue(this.metaTag);
  }


}
