import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubdocEditComponent } from './subdoc-edit.component';

describe('SubdocEditComponent', () => {
  let component: SubdocEditComponent;
  let fixture: ComponentFixture<SubdocEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubdocEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubdocEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
