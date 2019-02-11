
import $ from "jquery";
import utidy from "../../browser/dk-html";
import {Widget} from "../../widgetcore/dk-widget";
import page from "../../widgetcore/dk-page";
import {PanelWidget} from "../dk-panel";


test("panel-3", () => {
    document.body.innerHTML = `
    <div id="work">
    </div>
    `;
    const work = $('#work');
    page.initialize(document);

    var p = PanelWidget.create_inside(work, {
        title: 'Hello World'
    });
    p.collapse_up();

    expect(utidy(work.html())).toEqual(utidy(`
        <div class="PanelWidget panel-default dk-panel panel collapse-up" id="panel-widget" style="position: relative; overflow: hidden; max-height: 0px;">
            <header class="panel-heading" id="dk-bx">
                <div class="panel-title title" id="dk-bx">
                    <div class="collapseicon" id="dk-bx" style="cursor:pointer;">
                        <dk-icon value="folder-open-o:fw"></dk-icon>
                    </div>
                    <span class="headingtext" id="dk-bx">Hello World</span>
                </div>
            </header>
            <div style="overflow: auto;" class="panel-body" id="dk-bx"></div>
            <footer class="panel-footer" id="dk-bx"></footer>
        </div>
    `));
});
