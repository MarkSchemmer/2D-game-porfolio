import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TicTacToePageComponent } from "./tic-tac-toe-page.component";

describe("TicTacToePageComponent", () => {
  let component: TicTacToePageComponent;
  let fixture: ComponentFixture<TicTacToePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicTacToePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicTacToePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
