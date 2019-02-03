

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

    class HelloFoo extends Widget {
        draw() {
            this.widget().text('\nHello World!\n');
        }
    }

    HelloFoo.create_inside(work.find('.foo'), {});

    expect(utidy(work.html())).toEqual(utidy(`
        <div class="foo">
            <div id="widget">
                Hello World!
            </div>
        </div>
    `));
});
