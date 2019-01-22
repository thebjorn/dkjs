
import $ from "jquery";
import {create_dom} from "../dom";

test("create_dom", () => {
    const dom = create_dom('h1', {["class"]: "foo bar baz"});
    expect(dom.tagName).toBe('H1');
    expect($(dom).hasClass('bar')).toBeTruthy();
});
