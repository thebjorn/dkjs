

import $ from "jquery";
import {Template} from "../dk-dom-template";
import utidy from "../dk-html";

/**
 *  The structure can be nested arbitrarily deep, and you can pass in
 *  an object (`t` in this case), that will get accessors attached.
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
                    h3: {}
                }
            }
        }
    };
    const templ = new Template(structure);
    const t = {};
    templ.construct_on(work, undefined, t);
    t.level1.h1.text('H1');
    t.level1.level2.h2.text('H2');
    t.level1.level2.level3.h3.text('H3');
    
    expect(utidy(work.html())).toEqual(utidy(`
        <div class="level1">
            <h1>H1</h1>

            <div class="level2">
                <h2>H2</h2>

                <div class="level3">
                    <h3>H3</h3>
                </div>
            </div>
        </div>
    `));
});
