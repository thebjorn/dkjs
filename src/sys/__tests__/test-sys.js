
import ctor_apply from "../ctor-apply";

import {mcall} from "../mcall";
import {cls2pojo, is_function} from "../cls2pojo";


class Callable {
    constructor() {
        this.x = 100;
    }
    foo(a, b) {
        return this.x + a + b;
    }
}

test("mcall", () => {
    const widgets = {
        a: new Callable(),
        b: new Callable(),
        c: new Callable(),
        d: new Callable(),
        e() { return 42; },
        f: 100
    };
    expect(mcall(widgets, 'foo', 1, 2)).toEqual({
        a: 103,
        b: 103,
        c: 103,
        d: 103
    });
});


test("ctor-apply", () => {
    expect(ctor_apply(Date, [1970, 5, 2])).toEqual(new Date(1970, 5, 2));
});


test("cls2pojo", () => {
    expect(cls2pojo(new Callable())).toEqual({x: 100});
});

