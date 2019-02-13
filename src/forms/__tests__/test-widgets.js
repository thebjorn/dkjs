

import $ from "jquery";
import utidy from "../../browser/dk-html";
import {DurationWidget, TextInputWidget} from "../widgets";
import page from "../../widgetcore/dk-page";
import {Duration} from "../../data/datacore/dk-datatypes";


test("text-input-widget", () => {
    document.body.innerHTML = `
    <div id="work"><input></div>
    `;
    const work = $('#work');
    page.initialize(document);

    const w = TextInputWidget.create_on(work.find('input'));

    console.log("DATA:", w.widget().data('duration'));
    console.log("TYPE-PROP:", w.widget().prop('type'));
    console.log("VAL-PROP:", w.widget().val());
    console.log(work.html());
    
    expect(utidy(work.html())).toEqual(utidy(`
        <input class="TextInputWidget" id="text-input-widget" name="text_input_widget_1" type="text">
    `));

    w.value = 'forty-two';   // sets the widget prop, not attr
    expect($('#text-input-widget-1').val()).toBe('forty-two');
    expect(w.value).toBe('forty-two');
});



test("duration-widget", () => {
    document.body.innerHTML = `
    <div id="work"><input></div>
    `;
    const work = $('#work');
    page.initialize(document);

    const w = DurationWidget.create_on(work.find('input'));

    console.log("DATA:", w.widget().data('duration'));
    console.log("TYPE-PROP:", w.widget().prop('type'));
    console.log("VAL-PROP:", w.widget().val());
    console.log(work.html());

    expect(utidy(work.html())).toEqual(utidy(`
        <input class="DurationWidget" id="duration-widget" name="duration_widget_1" type="text">
    `));

    w.value = 3600;   // sets the widget prop, not attr
    console.log("W:", w);
    expect($('#' + w.id).val()).toEqual((new Duration(3600)).toString());
    expect(w.value).toEqual(new Duration(3600));
    
    // $('#' + w.id).attr('value', '1:00:01');  // .val(...) will not trigger onchange (see note: https://api.jquery.com/change/)
    w.widget().focus();
    w.widget().attr('value', '1:00:01');
    w.widget().blur();
    // w.widget().change();
    console.log(w.toString());
    expect(w.value).toEqual(new Duration(3601));
});
