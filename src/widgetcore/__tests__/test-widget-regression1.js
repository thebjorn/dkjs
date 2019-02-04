

import $ from "jquery";
import utidy from "../../browser/dk-html";
import {Widget} from "../dk-widget";
import page from "../dk-page";

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
    page.initialize(document);

    Widget.create_inside(work.find('.foo'),{
        draw() {
            this.widget().text('\nHello World!\n');
        }
    });

    expect(utidy(work.html())).toEqual(utidy(`
        <div class="foo">
            <div class="Widget" id="widget">
                Hello World!
            </div>
        </div>
    `));
});
