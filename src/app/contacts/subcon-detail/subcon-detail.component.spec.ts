import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubconDetailComponent } from './subcon-detail.component';

describe('SubconDetailComponent', () => {
  let component: SubconDetailComponent;
  let fixture: ComponentFixture<SubconDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubconDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubconDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
