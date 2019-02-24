import $ from 'jquery';
import {PagerWidget} from "../pager-widget";
import page from "../../widgetcore/dk-page";

test("test-pager-widget-render", () => {
    document.body.innerHTML = `
        <div id="work">
            
        </div>
    `;
    const work = $('#work');
    page.initialize(document);
    
    PagerWidget.create_inside(work, {pagecount: 10, curpage: 5});
    
    expect(document.getElementById('work')).toMatchSnapshot();
});
