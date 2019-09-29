
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

    // console.log(w);
    // console.log(work.html());
    //
    // expect(utidy(work.html())).toEqual(utidy(`
    //     <input class="TextInputWidget" id="text-input-widget-1" name="text_input_widget_1" type="text">
    // `));

    w.value = 'forty-two';   // sets the widget prop, not attr
    console.log(w.toString());
    expect($('#text-input-widget-1').val()).toBe('forty-two');
    expect(w.value).toBe('forty-two');


    // document.querySelector('#text-input-widget-1').setAttribute('value', 42);

    $('#text-input-widget-1').val(42).change();
    expect(w.value).toBe('42');

    w.data.readonly = true;
    // console.log("ATTRIBUTES:", w._get_attribute_data());

    console.log(work.html());
    expect(utidy(w.toString())).toEqual(utidy(`
        <input 
            class="TextInputWidget" 
            id="text-input-widget-1" 
            name="text_input_widget_1" 
            dk-readonly="true" 
            readonly="readonly" 
            dk-type="text" 
            dk-value="42">
    `));

});
