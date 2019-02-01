

import $ from "jquery";
import {Template} from "../dk-dom-template";
import utidy from "../dk-html";

/**
 * The `append_to()` method is useful when constructing lists.
 *
 */
test("dk.dom.Template(), depth=1, using accessors", () => {
    document.body.innerHTML = `
    <div id="work">
        <ul></ul>
    </div>
    `;
    const work = $('#work');

    function add(txt) {
        const structure = {
            li: { text: txt }
        };
        const templ = new Template(structure);
        const node = templ.append_to(work.find('ul'));
        node.li.css('font-weight', 'bold');
        node.li.attr('selected', true);
    }

    add("hello");
    add("world");
    
    expect(utidy(work.html())).toEqual(utidy(`
        <ul>
            <li selected style="font-weight: bold;">hello</li>
            <li selected style="font-weight: bold;">world</li>
        </ul>`
    ));
});
