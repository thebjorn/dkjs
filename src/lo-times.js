// @flow

/**
 * Returns an array of n elements with values from calling fn.
 * 
 * @param n
 * @param fn
 * @returns {Array}
 */
export function times<T>(n : number, fn : (number) => T) : Array<T> {
    const res = Array(n);
    for (let i=0; i<n; i++) {
        res[i] = fn(i);
    }
    return res;
}
