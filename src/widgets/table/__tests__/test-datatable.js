
import $ from 'jquery';
import utidy from "../../../browser/dk-html";
import page from "../../../widgetcore/dk-page";
import {ArraySource} from "../../../data/source/dk-array-datasource";
import {DataTable} from "../data-table";


test("test-datatable", () => {
    document.body.innerHTML = `
        <div id="work">
            
        </div>
    `;
    const work = $('#work');
    page.initialize(document);

    const dt = DataTable.create_inside(work, {
        datasource: ArraySource.create({
            data: [
                {project: 'Generelt NT', work: '1:03:57'},
                {project: 'Tiktok',      work: '2:44:57'},
                {project: 'AFR-support', work: '1:06:43'}
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
    
    console.log(dt); 
    
    // expect(dt.get_xy(1, 1).value).toEqual('2:44:57');
    expect(document.getElementById('work')).toMatchSnapshot();
    // expect(utidy(work.html())).toEqual(utidy(`
    //     <table class="DataTable dk-bx" id="data-table">
    //         <thead id="dk-bx">
    //         <tr id="dk-datatable">
    //             <th style="cursor: url(&quot;//static.datakortet.no/dk/sort-za.cur&quot;),pointer;" fieldname="project" scope="col" class="string" id="dk-datatable">
    //                 <div style="float: right; width: 2ex; margin-left: 2ex;" class="SortDirection sort-icon" id="sort-direction"></div>
    //                 Prosjekt
    //             </th>
    //             <th style="cursor: url(&quot;//static.datakortet.no/dk/sort-za.cur&quot;), pointer;" fieldname="work" scope="col" class="string" id="dk-datatable">
    //                 <div style="float: right; width: 2ex; margin-left: 2ex;" class="SortDirection sort-icon" id="sort-direction"></div>
    //                 Arbeid
    //             </th>
    //         </tr>
    //         </thead>
    //         <tfoot id="dk-datatable"></tfoot>
    //         <tbody id="dk-datatable">
    //         <tr rownum="0" pk="0" class="TableRow" id="dk-datatable">
    //             <td axis="project" class="TableCell" id="dk-tr">Generelt NT</td>
    //             <td axis="work" class="TableCell" id="dk-tr">1:03:57</td>
    //         </tr>
    //
    //         <tr rownum="1" pk="1" class="TableRow" id="dk-datatable">
    //             <td axis="project" class="TableCell" id="dk-tr">Tiktok</td>
    //             <td axis="work" class="TableCell" id="dk-tr">2:44:57</td>
    //         </tr>
    //
    //         <tr rownum="2" pk="2" class="TableRow" id="dk-datatable">
    //             <td axis="project" class="TableCell" id="dk-tr">AFR-support</td>
    //             <td axis="work" class="TableCell" id="dk-tr">1:06:43</td>
    //         </tr>
    //         </tbody>
    //     </table>
    // `));
});
