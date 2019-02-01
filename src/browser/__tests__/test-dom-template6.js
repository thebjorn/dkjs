

import $ from "jquery";
import {Template} from "../dk-dom-template";
import utidy from "../dk-html";

/**
 *  The structure can be nested arbitrarily deep. The creator
 *  functions are called for every label that they match. When
 *  they're called, all their children have been constructed.
 *
 */
test("dk.dom.Template(), depth=1, using accessors", () => {
    document.body.innerHTML = `
    <div id="work"></div>
    `;
    const work = $('#work');

    const structure = {
        level1: {
            h4: {}
        }
    };
    const creator = {
        construct_level1: function (level1) {
            if (level1.h4) {
                level1.h4.text("h4 from Level1");
            }
            return level1;
        },
        construct_h4: function (h4) {
            return h4.text('h4');
        }
    };
    const templ = new Template(structure);
    templ.construct_on(work, creator);

    expect(utidy(work.html())).toEqual(utidy(`
        <div class="level1">
            <h4>h4 from Level1</h4>
        </div>
    `));
});
