import { Observable } from "rxjs";
import { Product } from "schemas/product-list/product-list-schema";
import { R } from "schemas/rType";

export const generateRandomGuid = (): string => {
    let u = "";
    const m = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
    let i = 0;
    let rb = Math.random() * 0xffffffff | 0;
    while (i++ < 36) {
      const c = m[i - 1];
      const r = rb & 0xf;
      const v = c === "x" ? r : (r & 0x3 | 0x8);
      u += (c === "-" || c === "4") ? c : v.toString(16);
      rb = i % 8 === 0 ? Math.random() * 0xffffffff | 0 : rb >> 4;
    }

    return u;
  };

export const ObservableWrapper = (fn: Function) => (...args: any): Observable<Product[]> => {
    return fn(...args);
};

export const generateProductIdCode = (name: string, id: string) =>
 `(${id.slice(5)})-${name.length > 10 ? name.slice(7) + "..." : name}`;

export const generateProductWithNameAndImageUrl = (name: string, imageUrl: string): R<Product> => {
  const id: string = generateRandomGuid();
  const prod: R<Product> = {
      name,
      imageUrl,
      id,
      productIdCode: generateProductIdCode(name, id)
  };

  return prod;
};
