import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginLogicComponent } from './login-logic.component';

describe('LoginLogicComponent', () => {
  let component: LoginLogicComponent;
  let fixture: ComponentFixture<LoginLogicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginLogicComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginLogicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
