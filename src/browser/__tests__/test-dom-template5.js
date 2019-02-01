

import $ from "jquery";
import {Template} from "../dk-dom-template";
import utidy from "../dk-html";

/**
 *  In this example we've allready filled in part of the structure.
 *  
 *      <h3 style="border:3px solid green;"></h3>
 *      
 *  The template will discover this, and only insert the missing
 *
 */
test("dk.dom.Template(), depth=1, using accessors", () => {
    document.body.innerHTML = `
    <div id="work">
        <h3 style="border:3px solid green;"></h3>
    </div>
    `;
    const work = $('#work');

    const structure = {
        h3: {},
        content: {}
    };
    const creator = {
        construct_h3: function (location) { location.text('HELLO'); },
        construct_content: function (location) { location.text('WORLD'); }
    };
    const templ2 = new Template(structure);
    templ2.construct_on(work, creator);

    expect(utidy(work.html())).toEqual(utidy(`
        <h3 style="border:3px solid green;">HELLO</h3>

        <div class="content">WORLD</div>
    `));
});
