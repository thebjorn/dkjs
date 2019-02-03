import {pick} from "../pick";


test("pick", () => {
    const object = { 'a': 1, 'b': '2', 'c': 3 };
    expect(pick(object, ['a', 'c'])).toEqual({a: 1, c: 3});
});
