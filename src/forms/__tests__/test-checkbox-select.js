import $ from 'jquery';
import {CheckboxSelectWidget} from "../widgets";
import page from "../../widgetcore/dk-page";
import utidy from "../../browser/dk-html";


beforeEach(() => {
    document.body.innerHTML = `<div id="work"></div>`;
    page.initialize(document);    
});


test('checkbox-select-widget-render', () => {
    const work = $('#work');

    const w = CheckboxSelectWidget.create_on(work, {
        options: [
            'hello',
            'beautiful',
            'world'
        ],
        value: ['hello', 'world']
    });
    expect(w.widget(':checked')).toHaveLength(2);
    expect(document.getElementById('work')).toMatchSnapshot();
});

test("checkbox-select-widget-initial-value", () => {
    const work = $('#work');

    const w = CheckboxSelectWidget.create_on(work, {
        options: [
            'hello',
            'beautiful',
            'world'
        ],
        value: ['hello', 'world']
    });
    expect(w.widget_changed).toBeCalledTimes(1);
    expect(w.value).toEqual({hello: 'hello', world: 'world'});
});


test("checkbox-select-widget-dom-changed", () => {
    // document.body.innerHTML = `
    //     <div id="work">
    //     </div>
    // `;
    const work = $('#work');
    // page.initialize(document);

    const w = CheckboxSelectWidget.create_on(work, {
        options: [
            'hello',
            'beautiful',
            'world'
        ],
        value: ['hello', 'world']
    });
    expect(w.value).toEqual({hello: 'hello', world: 'world'});

    w.widget(':checkbox:eq(0)').click().change();
    expect(w.value).toEqual({world: 'world'});
});


test("checkbox-select-widget", () => {
    // document.body.innerHTML = `
    //     <div id="work">
    //     </div>
    // `;
    const work = $('#work');
    // page.initialize(document);

    const w = CheckboxSelectWidget.create_on(work, {
        options: [
            'hello',
            'beautiful',
            'world'
        ],
        value: ['hello', 'world']
    });
    // console.log(w);
    // console.log("OPETIONS:", w.options);
    // console.log("OPETIONS:", w._options);
    
    // expect(w.value).toEqual({hello: 'hello', world: 'world'});
    // expect(w.widget(':checked')).toHaveLength(2);
        
    w.widget(':checkbox:eq(0)').click().change();
    expect(w.value).toEqual({world: 'world'});

    // console.log("CHECKED:", w.widget(':checked').length);
    // expect(w.widget(':checked')).toHaveLength(1);
    //
    // // expect(w.formatted_value()).toBe('hello');
    // // expect(w.get_field_value()).toMatchObject({v: "0", f: 'hello'});
    //
    expect(utidy(work.html())).toEqual(utidy(`
        <label for="work-1" id="work-label">
            <input id="work-1" name="work" type="checkbox" value="hello">
            &nbsp;hello
        </label>
        <label for="work-2" id="work-label">
            <input id="work-2" name="work" type="checkbox" value="beautiful">
            &nbsp;beautiful
        </label>
        <label for="work-3" id="work-label">
            <input id="work-3" name="work" type="checkbox" value="world">
            &nbsp;world
        </label>
    `));
});
