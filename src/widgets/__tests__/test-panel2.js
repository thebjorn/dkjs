
import $ from "jquery";
import utidy from "../../browser/dk-html";
import {Widget} from "../../widgetcore/dk-widget";
import page from "../../widgetcore/dk-page";
import {PanelWidget} from "../dk-panel";


test("panel-2", () => {
    document.body.innerHTML = `
    <div id="work">
    </div>
    `;
    const work = $('#work');
    page.initialize(document);

    PanelWidget.create_inside(work);

    expect(utidy(work.html())).toEqual(utidy(`
        <div style="position: relative; overflow: hidden;" class="PanelWidget panel-default dk-panel panel" id="panel-widget">
            <header class="panel-heading" id="dk-bx">
                <div class="panel-title title" id="dk-bx">
                    <div class="collapseicon" id="dk-bx" style="cursor:pointer;">
                        <dk-icon value="folder-open-o:fw"></dk-icon>
                    </div><span class="headingtext" id="dk-bx"></span>
                </div>
            </header>
            <div style="overflow: auto;" class="panel-body" id="dk-bx"></div>
            <footer class="panel-footer" id="dk-bx"></footer>
        </div>
    `));
});
