import { range } from "utils/Utils";

interface ICell {
    isAlive: boolean;
    xRange: number;
    yRange: number;
}

export class Cell implements ICell {
    isAlive = false;
    xRange;
    yRange;
    createCell = () => this.isAlive = true;
    killCell = () => this.isAlive = false;

    cellIsDead = () => this.isAlive === false;
}

export const genConwaysBoard = (col, row) => {
    return range(1, col).map(
                            () => range(1, row).map(() => new Cell())
                        );
};

export const deepClone = obj => {
    let aux = obj;
    if (obj && typeof obj === "object") {
        aux = { ...obj };
        Object.getOwnPropertyNames(aux).forEach(prop => {
            aux[prop] = deepClone(aux[prop]);
        });
    } 

    return aux;
};


export function deepClone2(obj, hash = new WeakMap()) {
    if (Object(obj) !== obj) return obj; // primitives
    if (hash.has(obj)) return hash.get(obj); // cyclic reference
    const result = obj instanceof Set ? new Set(obj) // See note about this!
                 : obj instanceof Map ? new Map(Array.from(obj, ([key, val]) => 
                                        [key, deepClone2(val, hash)])) 
                 : obj instanceof Date ? new Date(obj)
                 : obj instanceof RegExp ? new RegExp(obj.source, obj.flags)
                 // ... add here any specific treatment for other classes ...
                 // and finally a catch-all:
                 : obj.constructor ? new obj.constructor() 
                 : Object.create(null);
    hash.set(obj, result);
    return Object.assign(result, ...Object.keys(obj).map(
        key => ({ [key]: deepClone2(obj[key], hash) }) ));
}
