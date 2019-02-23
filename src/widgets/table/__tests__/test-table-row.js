

import $ from "jquery";
import utidy from "../../../browser/dk-html";

import {TableRow} from "../table-row";

/**
 *
 */
test("table-cell", () => {
    document.body.innerHTML = `
    <div id="work">
        <table><tbody><tr></tr></tbody></table>    
    </div>
    `;
    const work = $('#work');

    const tr = TableRow.create_on(work.find('tr'));
    

    expect(utidy(work.html())).toEqual(utidy(`
        <table>
            <tbody>
                <tr>
                </tr>
            </tbody>
        </table>    
    `));
});
