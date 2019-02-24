
import $ from 'jquery';
import {SearchWidget} from "../search-widget";
import page from "../../widgetcore/dk-page";

test("test-search-widget-render", () => {
    document.body.innerHTML = `
        <div id="work">
            
        </div>
    `;
    const work = $('#work');
    page.initialize(document);
    
    SearchWidget.create_inside(work);
    
    expect(document.getElementById('work')).toMatchSnapshot();
});
