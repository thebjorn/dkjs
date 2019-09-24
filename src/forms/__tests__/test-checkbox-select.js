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
    console.log("WORK:", work.html());
    console.log("WIDGET:", w.widget().html());
    w.widget('[checked]').prop('checked', true);
    console.log(":CHECKED:", w.widget(':checked').length);
    console.log("[CHECKED]", w.widget('[checked]').length);
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
    expect(w.value).toEqual({hello: 'hello', world: 'world'});
});


test("checkbox-select-widget-dom-changed", () => {
    const work = $('#work');

    const w = CheckboxSelectWidget.create_on(work, {
        options: [
            'hello',
            'beautiful',
            'world'
        ],
        value: ['hello', 'world']
    });
    console.log('------------------------------------------')
    w.widget(':checkbox:eq(0)').click().change();
    console.log(work.html());
    expect(w.value).toEqual({world: 'world'});
});


test("checkbox-select-widget-value-changed", () => {
    const work = $('#work');

    const w = CheckboxSelectWidget.create_on(work, {
        options: [
            'hello',
            'beautiful',
            'world'
        ],
        value: ["hello"]
    });
    expect(w.value).toEqual({hello: 'hello'});
    w.value = ['beautiful', 'world'];
    expect(w.value).toEqual({beautiful: "beautiful", world: 'world'});
    expect(w.widget(':checkbox:checked')).toHaveLength(2);
});
