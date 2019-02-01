

import $ from "jquery";
import {Template} from "../dk-dom-template";
import utidy from "../dk-html";

/**
 *  The structure can be nested arbitrarily deep. The creator functions
 *  are called for every label that they match.
 *
 */
test("dk.dom.Template(), depth=1, using accessors", () => {
    document.body.innerHTML = `
    <div id="work"></div>
    `;
    const work = $('#work');

    const structure = {
        level1: {
            h1: {},
            level2: {
                h2: {},
                level3: {
                    h4: {},
                    level4: {
                        h4: {}
                    }
                }
            }
        }
    };
    const creator = {
        construct_h1: function (location) { return location.text('H1'); },
        construct_h2: function (location) { return location.text('H2'); },
        construct_h4: function (location) { return location.text('H4'); }
    };
    const templ = new Template(structure);
    templ.construct_on(work, creator);

    expect(utidy(work.html())).toEqual(utidy(`
        <div class="level1">
            <h1>H1</h1>

            <div class="level2">
                <h2>H2</h2>

                <div class="level3">
                    <h4>H4</h4>

                    <div class="level4">
                        <h4>H4</h4>
                    </div>
                </div>
            </div>
        </div>
    `));
});
