
import {vec_mul, zip, add, multiply_reduce, avg} from "../dk-math";

test('zip', () => {
    expect(zip(['a', 'b', 'c'], [1, 2, 3])).toEqual([['a', 1], ['b', 2], ['c', 3]]);
});


test("vec_mul", () => {
    expect(vec_mul([2, 3])).toBe(6);
});


test("avg", () => {
    expect(avg([1,2,3,4,5])).toBe(3);
});


test("add", () => {
    expect(add(1,2)).toBe(3);
});

test("multiply_reduce", () => {
    const a = [2, 3, 4];
    const b = [3, 4, 5];
    // mult = [6, 12, 20]
    // reduce = 38
    expect(multiply_reduce(a, b)).toBe(38);
    
    const c = [4, 5, 6];
    //mult  = [24, 60, 120]
    // reduce = 204
    
    expect(multiply_reduce(a, b, c)).toBe(204);
});
