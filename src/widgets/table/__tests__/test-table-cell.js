

import $ from "jquery";
import utidy from "../../../browser/dk-html";

import {TableCell} from "../table-cell";

/**
 *
 */
test("table-cell", () => {
    document.body.innerHTML = `
    <div id="work">
        <table><tbody><tr>
        <td></td>
        </tr></tbody></table>    
    </div>
    `;
    // const work = document.querySelector('#work');
    const work = $('#work');

    const tc = TableCell.create_on(work.find('td'));
    tc.value = 42;
    
    expect(utidy(work.html())).toEqual(utidy(`
        <table>
            <tbody>
                <tr>
                    <td></td>
                </tr>
            </tbody>
        </table>    
    `));
});
