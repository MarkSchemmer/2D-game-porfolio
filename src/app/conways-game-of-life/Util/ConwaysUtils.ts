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
