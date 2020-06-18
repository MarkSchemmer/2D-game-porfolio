import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsteroidsMainComponent } from './asteroids-main.component';

describe('AsteroidsMainComponent', () => {
  let component: AsteroidsMainComponent;
  let fixture: ComponentFixture<AsteroidsMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsteroidsMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsteroidsMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
