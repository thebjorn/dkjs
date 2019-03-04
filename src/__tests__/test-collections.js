import {matches, pick, pluck, where} from "../collections";
import {times} from "../lo-times";


test("pick", () => {
    const object = { 'a': 1, 'b': '2', 'c': 3 };
    expect(pick(object, ['a', 'c'])).toEqual({a: 1, c: 3});
});


test("matches", () => {
    expect(matches({a: 1, b:2}, {b:2})).toBeTruthy();
    expect(matches({a: 1, b:2}, {b:3})).toBeFalsy();
    expect(matches([1, 2, 3], [1, 3])).toBeTruthy();

    const fred = { 'user': 'fred',   'age': 40, 'active': true, 'pets': ['baby puss', 'dino']};
    expect(matches(fred, {pets:['dino']})).toBeTruthy();
});


test("where", () => {
    const users = [
        { 'user': 'barney', 'age': 36, 'active': false, 'pets': ['hoppy'] },
        { 'user': 'fred',   'age': 40, 'active': true, 'pets': ['baby puss', 'dino'] }
    ];
    
    console.log("WHERE1:", where(users, {age: 36, active: false}));
    const barney = pluck(where(users, {age: 36, active: false}), 'user');
    expect(barney).toEqual(['barney']);
    
    const fred = pluck(where(users, {pets:['dino']}), 'user');
    expect(fred).toEqual(['fred']);
});


test("lo-times", () => {
    expect(times(3, n => n)).toEqual([0, 1, 2]);
    expect(times(3, n => 'x')).toEqual(['x', 'x', 'x']);
});
