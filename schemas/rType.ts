
/*
    [Conditional types by ahejlsberg · Pull Request #21316 · microsoft/TypeScript · GitHub]
    (https://github.com/Microsoft/TypeScript/pull/21316)
*/

// Note(Mark): The immutability types are adapted from a tutorial by Anders Hejlsberg, the architect of TypeScript:
// https://github.com/Microsoft/TypeScript/pull/21316

// Note(Mark): The R<T> type is a recursively read-only version of T.
//
// Example:
// const person: R<Person> = getPerson();
// person.name = "Peter";             /* Compiler error */
// person.address.city = "Seattle";   /* Compiler error */
// person.parents[0].name = "John";   /* Compiler error */
// person.parents.push(p);            /* Compiler error */
//
// If you need to make changes to a R<T> variable, make a copy of it with mutable() or mutableArray().
export type R<T> =
    T extends any[] ? ImmutableArray<T[number]> :  // tslint:disable-line:no-any
    T extends object ? ImmutableObject<T> :
    T;

export interface ImmutableArray<T> extends ReadonlyArray<R<T>> { }

export type ImmutableObject<T> = {
    readonly [P in keyof T]: T[P] extends Function ? T[P] : R<T[P]>;
};
