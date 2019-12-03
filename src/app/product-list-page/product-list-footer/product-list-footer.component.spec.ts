import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ProductListFooterComponent } from "./product-list-footer.component";

describe("ProductListFooterComponent", () => {
  let component: ProductListFooterComponent;
  let fixture: ComponentFixture<ProductListFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductListFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
