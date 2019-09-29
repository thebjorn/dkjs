import $ from 'jquery';
import {RadioSelectWidget} from "../widgets";
import page from "../../widgetcore/dk-page";


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

    w.value = 'hello';
    expect(w.value).toEqual(['hello']);
});
