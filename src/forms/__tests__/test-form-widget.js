import {TextInputWidget} from "../widgets";
import $ from "jquery";
import page from "../../widgetcore/dk-page";
import {ArraySource} from "../../data/source/dk-array-datasource";
import {DataSet} from "../../data/dk-dataset";
import {DataTable} from "../../widgets/table/data-table";


test("test-ds-formwidget", () => {
    document.body.innerHTML = `
        <div id="work">
            <div id="table"></div>
            <div id="txtinput"></div>
        </div>
    `;
    const work = $('#work');
    page.initialize(document);

    const dt = DataTable.create_inside('#table', {
        datasource: [
            {f: 'a'},
            {f: 'b'},
            {f: 'c'},
        ]
    });
    
    const w = TextInputWidget.create_inside('#txtinput', {
        datasource: dt.table_data.value_ref({pk: 1, field: 'f'})
    });

    expect(dt.values()[1][0]).toEqual('b');
    expect(w.value).toEqual('b');
    w.value = 'foo';
    expect(dt.values()[1][0]).toEqual('foo');
});
