
import $ from "jquery";
import dom from "../dom";
import {Template, DomItem} from "../dk-dom-template";


test("create_dom", () => {
    const node = dom.create_dom('h1', {["class"]: "foo bar baz"});
    expect(node.tagName).toBe('H1');
    expect($(node).hasClass('bar')).toBeTruthy();
});


/**
 * The simplest form of creating a structure using dk.dom.Template().
 * We're saying the structure should have two sub-items, a `h3` element,
 * and a `div` with `class="content"`.
 *
 * After creating the _structure_, we add text to the created
 * elements.
 *
 */
test("dk.dom.Template(), depth=1, using accessors", () => {
    document.body.innerHTML = `
    <div id="work"></div>
    `;
    // const work = document.querySelector('#work');
    const work = $('#work');
    const structure = {
        h3: {},
        content: {}
    };
    const templ = Template.create(structure);
    const obj = templ.construct_on(work);
    obj.h3.text('hello');
    obj.content.text('world');

    expect(dom.equal(obj, `
        <h3>hello</h3>
        <div class="content">world</div>`
    )).toBeTruthy();
});
