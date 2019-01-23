import {_no_date, _no_datetime, bool, percent, sprintf, twodigits} from "../dk-format";

const dk = {f:sprintf};

test("printf", () => {
    // %.2f
    const world = 'world';
    console.log(`hello ${world}, pi = ${dk.f('%.2f', Math.PI)}.`);
    expect(
        `hello ${world}, pi = ${dk.f('%.2f', Math.PI)}.`
    ).toEqual("hello world, pi = 3.14.");

});


test("twodigits", () => {
    expect(twodigits(1)).toBe('01');
    expect(twodigits(11)).toBe('11');
});


test("percent", () => {
    expect(percent(51)).toBe('51%');
});


test("bool", () => {
    expect(bool('yes', 'no')(true)).toBe('yes');
    expect(bool('yes', 'no')(false)).toBe('no');
});

test("_no_date", () => {
    expect(
        _no_date(new Date(2019, 0, 23, 16, 1))
    ).toEqual("23.01.2019");
});

test("_no_datetime", () => {
    expect(
        _no_datetime(new Date(2019, 0, 23, 16, 1))
    ).toEqual("23.01.2019 kl.16.01:00");
});
