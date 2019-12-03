import { Injectable } from "@angular/core";
import { getProducts } from "../../../product-api/product-api";

@Injectable({
  providedIn: "root"
})
export class ProductService {

  constructor() { }

  public getProducts = () => getProducts();

  }
