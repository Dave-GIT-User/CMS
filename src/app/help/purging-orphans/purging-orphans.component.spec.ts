import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurgingOrphansComponent } from './purging-orphans.component';

describe('PurgingOrphansComponent', () => {
  let component: PurgingOrphansComponent;
  let fixture: ComponentFixture<PurgingOrphansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PurgingOrphansComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PurgingOrphansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
