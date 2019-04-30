import $ from 'jquery';
import {RadioSelectWidget} from "../widgets";
import page from "../../widgetcore/dk-page";
import utidy from "../../browser/dk-html";


test("radio-select-widget", () => {
    document.body.innerHTML = `
        <div id="work">
            
        </div>
    `;
    const work = $('#work');
    page.initialize(document);

    const w = RadioSelectWidget.create_on(work, {
        options: [
            'hello',
            'world'
        ]
    });
    w.value = 'hello';
    expect(w.value).toEqual({hello: 'hello'});
    console.log("CHECKED VAL:", w.widget(':checked').length);
    // console.log("RADIOS:", w._radios.map(r => r.prop('checked')));
    // console.log("RADIOS:", w._radios.forEach(r => console.log(r[0].outerHTML)));
    console.log(w);
    expect(w.widget(':radio:checked').val()).toBe("hello");
    
    work.find(':radio:eq(1)').click().change();
    // console.log(work.html());
    console.log(w.toString());
    
    expect(w.value).toEqual({world: "world"});
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
