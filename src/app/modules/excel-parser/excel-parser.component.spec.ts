import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelParserComponent } from './excel-parser.component';

describe('ExcelParserComponent', () => {
  let component: ExcelParserComponent;
  let fixture: ComponentFixture<ExcelParserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExcelParserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExcelParserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
