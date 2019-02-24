import $ from 'jquery';
import page from "../../../../widgetcore/dk-page";
import {DataGrid} from "../datagrid";


test("test-resultset-render", () => {
    document.body.innerHTML = `
        <div id="work">
            
        </div>
    `;
    const work = $('#work');
    page.initialize(document);

    DataGrid.create_inside(work);

    expect(document.getElementById('work')).toMatchSnapshot();
});
