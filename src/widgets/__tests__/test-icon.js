
import $ from "jquery";
import utidy from "../../browser/dk-html";
import {Widget} from "../../widgetcore/dk-widget";
import page from "../../widgetcore/dk-page";
import {icon} from "../dk-icon-library";


test("dkicon1", () => {
    document.body.innerHTML = `
    <div id="work">
    </div>
    `;
    const work = $('#work');
    page.initialize(document);

    work.append(icon('close:fw'));    

    expect(utidy(work.html())).toEqual(utidy(`
        <i class="close fa fa-close fa-fw icon"></i>
    `));
});
