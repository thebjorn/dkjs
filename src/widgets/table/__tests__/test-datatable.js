
import $ from 'jquery';
import utidy from "../../../browser/dk-html";
import page from "../../../widgetcore/dk-page";
import {ArraySource} from "../../../data/source/dk-array-datasource";
import {DataTable} from "../data-table";


test("test-datatable", () => {
    document.body.innerHTML = `
        <div id="work"></div>
    `;
    const work = $('#work');
    page.initialize(document);

    const dt = DataTable.create_inside(work, {
        datasource: ArraySource.create({
            data: [
                {project: 'Generelt NT', work: '1:03:57'},
                {project: 'Tiktok',      work: '2:44:57'},
                {project: 'FOO-support', work: '1:06:43'}
            ]
        }),
        columns: {
            project: {
                label: 'Prosjekt'
            },
            work: {
                label: 'Arbeid'
            }
        }
    });
    work.find('th:eq(0)').click();  // sort on project header (z-a) Tiktok row will be first
    
    // console.log(dt); 
    
    expect(dt.get_xy(1, 0).value).toEqual('2:44:57');
    expect(document.getElementById('work')).toMatchSnapshot();
});
