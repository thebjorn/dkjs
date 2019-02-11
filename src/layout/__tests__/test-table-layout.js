


import $ from "jquery";
import utidy from "../../browser/dk-html";
import {Widget} from "../../widgetcore/dk-widget";
import page from "../../widgetcore/dk-page";
import {TableLayout, ResultsetLayout, TableRowLayout} from "../table-layout";


test("table-row-layout", () => {
    document.body.innerHTML = `
    <div id="work">
        <table>
            <tbody>
                <tr></tr>
            </tbody>
        </table>
    </div>
    `;
    const work = $('#work');
    page.initialize(document);

    class W extends Widget {
        constructor(...args) {
            super({
                dklayout: TableRowLayout,
                template: {
                    root: 'tr'
                }
            }, ...args);
        }
    }
    const w = W.create_on(work.find('tr'));
    w.layout.add_th().text('hello');
    w.layout.add_td().text('world');
    console.log(work.html());

    expect(utidy(work.html())).toEqual(utidy(`
        <table>
            <tbody>
                <tr class="W" id="w">
                    <th id="dk-tr-1">
                        hello
                    </th>
                    <td id="dk-tr-2">
                        world
                    </td>
                </tr>
            </tbody>
        </table>
    `));
});


test("table-layout", () => {
    document.body.innerHTML = `
    <div id="work">
        <table></table>
    </div>
    `;
    const work = $('#work');
    page.initialize(document);

    class T extends Widget {
        constructor(...args) {
            super({
                dklayout: TableLayout,
                template: {
                    root: 'table'
                }
            }, ...args);
        }
    }
    const w = T.create_on(work.find('table'));
    const header = w.layout.add_header_row();
    const body = w.layout.add_body_row();
    const footer = w.layout.add_footer_row();
    
    const cells = w.layout.add_column();
    console.log(work.html());

    expect(utidy(work.html())).toEqual(utidy(`
        <table class="T dk-bx" id="t-1">
            <thead id="dk-bx-2">
                <tr id="dk-table">
                    <th id="dk-table"></th>
                </tr>
            </thead>
            <tfoot id="dk-bx">
                <tr id="dk-table">
                    <td id="dk-table"></td>
                </tr>
            </tfoot>
            <tbody id="dk-bx">
                <tr id="dk-table">
                    <td id="dk-table"></td>
                </tr>
            </tbody>
        </table>
    `));
});
