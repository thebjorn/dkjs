import $ from 'jquery';
import {SelectWidget} from "../widgets";
import page from "../../widgetcore/dk-page";
import utidy from "../../browser/dk-html";


test("select-widget", () => {
    document.body.innerHTML = `
        <div id="work">
            
        </div>
    `;
    const work = $('#work');
    page.initialize(document);
    
    const w = SelectWidget.create_inside(work, {
        size: 2,
        multiple: true,
        options: {
            1: 'hello',
            2: 'world'
        } 
    });
    // console.log(w);
    work.find('option[value=1]').click();
    w.widget().change();
    console.log(work.html());
    
    expect(w.formatted_value()).toBe('hello');
    expect(w.get_field_value()).toMatchObject({v: "1", f: 'hello'});
    
    expect(utidy(work.html())).toEqual(utidy(`
        <select class="SelectWidget" id="select-widget" name="select_widget_1">
            <option selected="selected" value="1">hello</option>
            <option value="2">world</option>
        </select>
    `));
});
