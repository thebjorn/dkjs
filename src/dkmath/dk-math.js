// @flow


// for when you need named functions..
export const add = (a: number, b: number): number => a + b;
export const mul = (a: number, b: number): number => a * b;

export const zip = (...rows: any[]) => [...rows[0]].map((_, c) => rows.map(row => row[c]));

/**
 * Return the product of all elements in `vec`.
 * @param vec - array of int
 * @returns {*} - int
 */
export const vec_mul = (vec: number[]): number => vec.reduce(mul, 1);


export const avg = (vec: number[]): number => (vec.reduce(add, 0) / vec.length);

/**
 * Return the sum of the product of each index for all arrays passed.
 * `args` are equal length arrays of int.
 * @param args
 */
export function multiply_reduce(...args: number[]): number {
    return zip(...args).map(vec_mul).reduce(add, 0);
}
