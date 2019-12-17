import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ProductListEditFormComponent } from "./product-list-edit-form.component";

describe("ProductListEditFormComponent", () => {
  let component: ProductListEditFormComponent;
  let fixture: ComponentFixture<ProductListEditFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductListEditFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
