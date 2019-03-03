
import $ from 'jquery';
import {VDataTable} from "../vdata-table"
import utidy from "../../../../browser/dk-html";
import page from "../../../../widgetcore/dk-page";


test("test-show-record", () => {
    document.body.innerHTML = `
        <div id="work">
            <table id="mydt" class="table table-bordered table-striped"></table>
        </div>
    `;
    const work = $('#work');
    page.initialize(document);

    const mydt = VDataTable.create_on('#mydt', {
        datasource: [
            {project: 'FOO-support', work: '1:11:11', age: 42},
        ],
        columns: {
            project: {
                label: 'Prosjekt',
                format: function (val) {
                    return (val || '').toLowerCase();
                }
            },
            work: {
                label: 'Arbeid'
            },
            age: {}
        }
    });
    
    console.log(work.html());
    
    expect(utidy(work.html())).toEqual(utidy(`
        <table class="dk-bx table table-bordered table-striped vdatatable" id="mydt">
            <thead id="dk-bx">
            </thead>
            <tfoot id="dk-bx">
            </tfoot>
            <tbody id="dk-bx">
                <tr id="dk-vdatatable">
                    <th class="TableHeader" fieldname="project" id="table-header" scope="col" title="title">
                        Prosjekt
                    </th>
                    <td axis="project" class="TableCell vTableColumn" id="dk-vdatatable">
                        foo-support
                    </td>
                </tr>
                <tr id="dk-vdatatable">
                    <th class="TableHeader" fieldname="work" id="table-header" scope="col" title="title">
                        Arbeid
                    </th>
                    <td axis="work" class="TableCell" id="dk-vdatatable">
                        1:11:11
                    </td>
                </tr>
                <tr id="dk-vdatatable">
                    <th class="TableHeader" fieldname="age" id="table-header" scope="col" title="title">
                        age
                    </th>
                    <td axis="age" class="TableCell" id="dk-vdatatable">
                        42
                    </td>
                </tr>
            </tbody>
        </table>
    `));
});
