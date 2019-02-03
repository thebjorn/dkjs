

import $ from "jquery";
import utidy from "../../browser/dk-html";
import {Widget} from "../dk-widget";

/**
 *  You can create an object inside a dom object found by its
 *  `class`-selector.
 *
 */
test("Widget.create_inside(.class)", () => {
    document.body.innerHTML = `
    <div id="work">
        <div class="foo"></div>
    </div>
    `;
    const work = $('#work');

    Widget.create_inside(work.find('.foo'), {
        draw: function () {
            this.widget().text('\nHello World!\n');
        }
    });

    expect(utidy(work.html())).toEqual(utidy(`
        <div class="foo">
            <div id="widget">
                Hello World!
            </div>
        </div>
    `));
});
