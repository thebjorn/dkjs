
import $ from "jquery";
import dom from "../dom";

test("create_dom", () => {
    const node = dom.create_dom('h1', {["class"]: "foo bar baz"});
    expect(node.tagName).toBe('H1');
    expect($(node).hasClass('bar')).toBeTruthy();
});
