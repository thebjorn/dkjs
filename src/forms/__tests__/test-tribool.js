
import $ from 'jquery';
import page from "../../widgetcore/dk-page";
import {TriboolWidget} from "../widgets";


test("tribool", () => {
    document.body.innerHTML = `
        <div id="work">
            <label>hello world</label>
        </div>
    `;
    const work =  $('#work');
    page.initialize(document);
    
    const w = TriboolWidget.create_inside(work);
    
    expect(document.getElementById('work')).toMatchSnapshot();
});
