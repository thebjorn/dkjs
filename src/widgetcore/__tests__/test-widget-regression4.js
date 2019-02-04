

import $ from "jquery";
import utidy from "../../browser/dk-html";
import {Widget} from "../dk-widget";
import page from "../dk-page";

/**
 *  append_to
 *
 */
test("Widget.append_to(.class)", () => {
    document.body.innerHTML = `
    <div id="work">
    </div>
    `;
    const work = $('#work');
    page.initialize(document);

    Widget.append_to(work, {
        draw() {
            this.widget().text('\nHello World!\n');
        }
    });

    expect(utidy(work.html())).toEqual(utidy(`
        <div class="Widget" id="widget">
            Hello World!
        </div>
    `));
});
