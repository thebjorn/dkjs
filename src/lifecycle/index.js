
import "./dk-polyfills";

import Lifecycle from "./lifecycle";

//
const set_isemptyset = a => a.size === 0;

// a | b
const set_union = (a, b) => new Set([...a, ...b]);

// a & b
const set_intersection = (a, b) => new Set([...a].filter(x => b.has(x)));

// a - b
const set_difference = (a, b) => new Set([...a].filter(x => !b.has(x)));

// a <= b
const set_issubset = (a, b) => set_isemptyset(set_difference(a, b));

// a >= b
const set_issuperset = (a, b) => set_isemptyset(set_difference(b, a));

// a ^ b
const set_symetric_difference = (a, b) => set_difference(set_union(a, b), set_intersection(a, b));


export default Lifecycle;
