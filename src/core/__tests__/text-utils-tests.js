
import {id2name, cls2id, count_char, dedent} from "../text-utils";


test("id2name", () => {
    expect(id2name("hello-world")).toEqual('hello_world');
});


test("cls2id", () => {
    expect(cls2id("HelloWorld")).toEqual("hello-world");
});


test("count-char", () => {
    expect(count_char("hello world", "l")).toEqual(3);
});


test("dedent", () => {
    expect(dedent(`
        hello
        world
    `)).toEqual(
        "\nhello\nworld\n"
    );
});


test("dedent-block", () => {
    expect(dedent(`
        hello
            beautiful
        world
    `)).toEqual(
        "\nhello\n    beautiful\nworld\n"
    );
});


test("dedent-json", () => {
    const txt = `
        hello
        foo: [
    1
]
        world
    `;
    expect(dedent(txt)).toEqual(txt);
});
