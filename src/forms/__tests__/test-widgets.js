

import $ from "jquery";
import utidy from "../../browser/dk-html";
import {TextInputWidget} from "../widgets";
import page from "../../widgetcore/dk-page";


test("text-input-widget", () => {
    document.body.innerHTML = `
    <div id="work"><input></div>
    `;
    const work = $('#work');
    page.initialize(document);

    const w = TextInputWidget.create_on(work.find('input'));
    
    console.log(work.html());
    
    expect(utidy(work.html())).toEqual(utidy(`
        <input class="TextInputWidget" id="text-input-widget" name="text_input_widget_1" type="text">
    `));

    w.value = 'forty-two';   // sets the widget prop, not attr
    expect($('#text-input-widget-1').val()).toBe('forty-two');
});
