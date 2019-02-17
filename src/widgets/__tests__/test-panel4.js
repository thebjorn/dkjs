
import $ from "jquery";
import utidy from "../../browser/dk-html";
import {Widget} from "../../widgetcore/dk-widget";
import page from "../../widgetcore/dk-page";
import {PanelWidget} from "../dk-panel";


test("panel-4", () => {
    document.body.innerHTML = `
    <div id="work">
    </div>
    `;
    const work = $('#work');
    page.initialize(document);

    const p = PanelWidget.create_inside(work, {
        title: 'Hello World'
    });
    p.collapse_left();

    expect(utidy(work.html(), {style: false})).toEqual(utidy(`        
        <div class="PanelWidget panel-default dk-panel panel" id="panel-widget">
            <header class="panel-heading" id="dk-bx">
                <div class="panel-title title" id="dk-bx">
                    <div class="collapseicon" id="dk-bx">
                        <dk-icon value="folder-open-o:fw"></dk-icon>
                    </div>
                    <span class="headingtext" id="dk-bx">Hello World</span>
                </div>
            </header>
            <div class="panel-body" id="dk-bx"></div>
            <footer class="panel-footer" id="dk-bx"></footer>
        </div>
    `));
});
