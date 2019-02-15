
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

    console.log(w);
    console.log(work.html());
    
    expect(utidy(work.html())).toEqual(utidy(`
        <input class="TextInputWidget" id="text-input-widget-1" name="text_input_widget_1" type="text">
    `));

    w.value = 'forty-two';   // sets the widget prop, not attr
    expect($('#text-input-widget-1').val()).toBe('forty-two');
    expect(w.value).toBe('forty-two');
    
    // document.querySelector('#text-input-widget-1').setAttribute('value', 42);
    
    $('#text-input-widget-1').val(42).change();
    expect(w.value).toBe('42');
    
    w.data.readonly = true;
    console.log(work.html());
    expect(utidy(work.html())).toEqual(utidy(`
        <input class="TextInputWidget" id="text-input-widget" readonly="readonly" name="text_input_widget_1" type="text" value="42">
    `));

});



test("duration-widget", () => {
    document.body.innerHTML = `
    <div id="work"><input name="foo"></div>
    `;
    const work = $('#work');
    page.initialize(document);

    const w = DurationWidget.create_on(work.find('input'));

    expect(utidy(work.html())).toEqual(utidy(`
        <input class="DurationWidget" id="duration-widget" name="foo" type="text">
    `));

    w.value = 3600;   // sets the widget prop, not attr
    console.log('w.value', w.value);
    console.log('w.value', w.data.value);
    console.log('typeof w.value', typeof w.value);
    console.log("W:", w);
    console.log('new duration:', (new Duration(3600)).toString());
    console.log('.val:', $('#' + w.id).val(), typeof $('#' + w.id).val());
    expect($('#' + w.id).val()).toEqual((new Duration(3600)).toString());
    expect(w.value).toEqual(new Duration(3600));
    
    // $('#' + w.id).attr('value', '1:00:01');  // .val(...) will not trigger onchange (see note: https://api.jquery.com/change/)
    w.widget().attr('value', '1:00:01').val('1:00:01').change();
    console.log(w.toString());
    expect(w.value).toEqual(new Duration(3601));
});


test("duration-create-inside", () => {
    document.body.innerHTML = `
        <div id="work">
            
        </div>
    `;
    const work = $('#work');
    page.initialize(document);
    
    const w = DurationWidget.create_inside(work);
    expect(w.value).toEqual(null);
    
    expect(utidy(work.html())).toEqual(utidy(`
         <input class="DurationWidget" id="duration-widget" name="duration_widget_2" type="text">
    `));
});



test("duration-widget2", () => {
    document.body.innerHTML = `
    <div id="work"><input></div>
    `;
    const work = $('#work');
    page.initialize(document);

    const w = DurationWidget.create_on(work.find('input'));

    expect(utidy(work.html())).toEqual(utidy(`
        <input class="DurationWidget" id="duration-widget" name="duration_widget_3" type="text">
    `));

    w.value = 3600;   // sets the widget prop, not attr
    console.log('w.value', w.value);
    console.log('w.value', w.data.value);
    console.log('typeof w.value', typeof w.value);
    console.log("W:", w);
    console.log('new duration:', (new Duration(3600)).toString());
    console.log('.val:', $('#' + w.id).val(), typeof $('#' + w.id).val());
    expect($('#' + w.id).val()).toEqual((new Duration(3600)).toString());
    expect(w.value).toEqual(new Duration(3600));

    // $('#' + w.id).attr('value', '1:00:01');  // .val(...) will not trigger onchange (see note: https://api.jquery.com/change/)
    w.widget().attr('value', '1:00:01').val('1:00:01').change();
    console.log(w.toString());
    expect(w.value).toEqual(new Duration(3601));
});
















































