
import $ from 'jquery';
import {PagerWidget} from "../../../pager-widget";
import page from "../../../../widgetcore/dk-page";
import {DataSet} from "../../../../data/dk-dataset";
import {DataTable} from "../../../table/data-table";
import {ArraySource} from "../../../../data/source/dk-array-datasource";
import {ResultSet} from "../resultset";
import utidy from "../../../../browser/dk-html";


test("test-pagerwidget-with-datatable-datasource-shortcut", () => {
    document.body.innerHTML = `
        <div id="work">
        </div>
    `;
    const work = $('#work');
    page.initialize(document);

    ResultSet.create_inside(work, {
        construct_table: function (location, downloadwidget) {
            return DataTable.create_on(location, {
                classes: ['table table-bordered table-hover table-condensed'],
                download: downloadwidget,
                datasource: [
                    {project: 'first', work: '1:03:57'},
                    {project: 'aTiktok', work: '2:44:57'},
                    {project: 'bGenerelt NT', work: '1:03:57'},
                    {project: 'cTiktok', work: '2:44:57'},
                    {project: 'dGenerelt NT', work: '1:03:57'},
                    {project: 'eTiktok', work: '2:44:57'},
                    {project: 'fGenerelt NT', work: '1:03:57'},
                    {project: 'gTiktok', work: '2:44:57'},
                    {project: 'hGenerelt NT', work: '1:03:57'},
                    {project: 'iTiktok', work: '2:44:57'},
                    {project: 'jGenerelt NT', work: '1:03:57'},
                    {project: 'kTiktok', work: '2:44:57'},
                    {project: 'last', work: '1:06:43'}
                ],
                pagesize: 5,
                orphans: 4,
                columns: {
                    project: {label: 'Prosjekt'},
                    work: {label: 'Arbeid'}
                }
            });
        }
    });
    
    // console.log(utidy(work.html()));

    expect(document.getElementById('work')).toMatchSnapshot();
});
