import is from "../is";


test("is-empty", () => {
    expect(is.isEmpty({length:0})).toBeFalsy();
    expect(is.isEmpty(null)).toBeTruthy();
    expect(is.isEmpty(true)).toBeTruthy();
    expect(is.isEmpty(1)).toBeTruthy();
    expect(is.isEmpty([1,2,3])).toBeFalsy();
    expect(is.isEmpty({a:1})).toBeFalsy();
});


test("is-equal", () => {
    expect(is.isEqual("5", new String("5"))).toBeTruthy();
});
