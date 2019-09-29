import $ from 'jquery';
import {RadioSelectWidget} from "../widgets";
import page from "../../widgetcore/dk-page";
import utidy from "../../browser/dk-html";


test("radio-select-widget", () => {
    document.body.innerHTML = `<div id="work"></div>`;
    const work = $('#work');
    page.initialize(document);

    const w = RadioSelectWidget.create_on(work, {
        options: [
            'hello',
            'world'
        ]
    });
    expect(w.options).toEqual({"hello": "hello", "world": "world"});
    expect(w.value).toEqual([]);
    expect(w._selected).toEqual({hello: false, world: false});
    
    work.find('input[type=radio]:eq(0)').click().change();
    
    expect(w.widget('input[type=radio]:checked')).toHaveLength(1);
    expect(w.widget('input[type=radio]:checked').val()).toEqual('hello');
    expect(w.value).toEqual(["hello"]);
    
    // console.log(work.html());
    work.find(':radio:eq(1)').click().change(); 
    // console.log(work.html());
    // console.log(w.toString());
    
    expect(w.value).toEqual(["world"]);
    // expect(w.formatted_value()).toBe('hello');
    // expect(w.get_field_value()).toMatchObject({v: "0", f: 'hello'});

    expect(utidy(work.html())).toEqual(utidy(`
        <label for="work" id="work-label">
            <input id="work" name="work" type="radio" value="hello">hello
        </label>
        <label for="work" id="work-label">
            <input id="work" name="work" type="radio" value="world">world
        </label>
    `));
});
