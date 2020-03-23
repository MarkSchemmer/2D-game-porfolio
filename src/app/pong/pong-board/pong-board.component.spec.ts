import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PongBoardComponent } from './pong-board.component';

describe('PongBoardComponent', () => {
  let component: PongBoardComponent;
  let fixture: ComponentFixture<PongBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PongBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PongBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
