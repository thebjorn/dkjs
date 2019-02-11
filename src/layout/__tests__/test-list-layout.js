
import $ from "jquery";
import utidy from "../../browser/dk-html";
import {Widget} from "../../widgetcore/dk-widget";
import page from "../../widgetcore/dk-page";
import {ListLayout} from "../list-layout";


test("list-layout", () => {
    document.body.innerHTML = `
    <div id="work">
        <ol id="foo"></ol>
    </div>
    `;
    const work = $('#work');
    page.initialize(document);

    class W extends Widget {
        constructor(...args) {
            super({
                dklayout: ListLayout,
                template: {
                    root: 'ol'
                }
            }, ...args);
        }
    }
    const w = W.create_on(work.find('#foo'));
    w.layout.add_li().text('hello');
    w.layout.add_li().text('world');
    console.log(work.html());

    expect(utidy(work.html())).toEqual(utidy(`
        <ol class="W" id="foo">
            <li id="dk-list-1">hello</li>
            <li id="dk-list-2">world</li>
        </ol>
    `));
});
