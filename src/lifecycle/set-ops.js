
/*
 *  Javascript has defined Set objects, but no operations...?
 *
 */
// empty set?
export const set_empty = s => s.size === 0;

// a | b
export const set_union = (a, b) => new Set([...a, ...b]);

// a & b
export const set_intersection = (a, b) => new Set([...a].filter(x => b.has(x)));

// a - b
export const set_difference = (a, b) => new Set([...a].filter(x => !b.has(x)));

// a <= b
export const set_issubset = (a, b) => set_empty(set_difference(a, b));

// a >= b
export const set_issuperset = (a, b) => set_empty(set_difference(b, a));

// a ^ b
export const set_xor = (a, b) => set_difference(set_union(a, b), set_intersection(a, b));



export const array_union = (a, b) => set_union(new Set(a), new Set(b));
export const array_intersection = (a, b) => set_intersection(new Set(a), new Set(b));
export const array_issubset = (a, b) => set_issubset(new Set(a), new Set(b));
export const array_issuperset = (a, b) => set_issuperset(new Set(a), new Set(b));
export const array_xor = (a, b) => set_xor(new Set(a), new Set(b));
