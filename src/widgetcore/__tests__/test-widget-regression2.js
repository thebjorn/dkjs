

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

    Widget.extend({
        __name__: 'widget',
        draw: function() {
            this.widget().text('\nHello World!\n');
        }
    }).create_on(work.find('.foo'));

    expect(utidy(work.html())).toEqual(utidy(`
        <div class="foo" id="widget">
            Hello World!
        </div>
    `));
});
