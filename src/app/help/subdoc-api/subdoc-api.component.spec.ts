import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubdocApiComponent } from './subdoc-api.component';

describe('SubdocApiComponent', () => {
  let component: SubdocApiComponent;
  let fixture: ComponentFixture<SubdocApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubdocApiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubdocApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
