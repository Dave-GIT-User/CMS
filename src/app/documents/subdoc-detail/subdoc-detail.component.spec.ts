import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubdocDetailComponent } from './subdoc-detail.component';

describe('SubdocDetailComponent', () => {
  let component: SubdocDetailComponent;
  let fixture: ComponentFixture<SubdocDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubdocDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubdocDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
