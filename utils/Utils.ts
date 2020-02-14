import { Product } from "schemas/product-list/product-list-schema";
import { R } from "schemas/rType";

declare const $: any;

const productModal: string = "#productModal";
// const show: string = "show";
const hide: string = "hide";

const showProductModalOptions = {
  keyboard: false,
  focus: true,
  show: true,
  backdrop: "static"
};

export const showProductModal = () => $(productModal).modal(showProductModalOptions);

export const hideProductModal = () => $(productModal).modal(hide);

export const isNullOrUndefined = (value: unknown): boolean => value === null || value === undefined;

export const not = fn => (...args) => !fn(...args);

export const isValue = (value: unknown): boolean => not(isNullOrUndefined)(value);

export const isNonEmptyArray = (value: Array<unknown>): boolean => isValue(value) && value.length > 0;

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

export const generateProductIdCode = (name: string, id: string) =>
 `(${id.split("").slice(0, 5).join("")})-${name.length > 10 ? name.split("").slice(0, 7).join("") + "..." : name}`;

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

// const findId = (id: string) => (prod: Product) => prod.id === id;
const notById = (id: string) => (prod: Product) => not(prod.id === id);

export const filterListById = (id: string, productList: R<Product[]>): R<Product[]> =>
        productList.filter(notById(id));

export const updateItemInList = (product: Product, productList: R<Product[]>): R<Product[]> =>
        productList.map((prod: Product) => product.id === prod.id ? product : prod);

export const range = (x: number, y: number, incrementer: number = 1): number[] => {
          const which = x < y;
          const xx = which ? x : y;
          const yy = which ? y : x;

          const calculator = (xxx: number = xx, yyy: number = yy, rango = []) => {
              const newMappedArray = xxx <= yyy ? acendingOrDecendingArr(rango, xxx, which) : rango;
              return xxx >= yyy ? newMappedArray : calculator(xxx + incrementer, yyy, newMappedArray);
          };

          return calculator(xx, yy);
      };

export const acendingOrDecendingArr =
      (arr: number[], elem: number, which: boolean): number[] =>
                    which ? [...arr, elem] : [elem, ...arr];

/*
    Need to make deepClone that is not using JSON.parse strategy
    Make a curry function using bind()
    Make a pipe function using bind()
    Make a partial curry using bind()
    Make a thunk funciton
*/

export const curry = (fn, len = fn.length) =>
                                    len === 0
                                    ? fn()
                                    : p => isValue(p) ? curry(fn.bind(null, p), len - 1)
                                                      : curry(fn, len);

export const shuffle = arr => {
    for (let i = 0; i < arr.length; i++) {
      const ranomChange = Math.floor(Math.random() * (i + 1));
      const temp = arr[i];
      arr[i] = arr[ranomChange];
      arr[ranomChange] = temp;
    }

    return arr;
};
