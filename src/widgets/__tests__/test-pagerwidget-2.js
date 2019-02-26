
import $ from 'jquery';
import {PagerWidget} from "../pager-widget";
import page from "../../widgetcore/dk-page";
import {DataSet} from "../../data/dk-dataset";
import {DataTable} from "../table/data-table";
import {ArraySource} from "../../data/source/dk-array-datasource";


test("test-pagerwidget-with-datatable", () => {
    document.body.innerHTML = `
        <div id="work">
            <div class="container">
                <div class="dtbl"></div>
                <div class="pgr"></div>
            </div>
        </div>
    `;
    const work = $('#work');
    page.initialize(document);

    const dt = DataTable.create_inside(work.find('.container > .dtbl'), {
        table_data: DataSet.create({
            datasource: ArraySource.create([
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
            ]),
            pagesize: 5,
            orphans: 4
        }),

        columns: {
            project: {label: 'Prosjekt'},
            work: {label: 'Arbeid'}
        }
    });
    const pg = dt.table_data.page;
    expect(dt.table_data.page.recordset.meta.pagecount).toBe(2);
    const pager = PagerWidget.create_inside(work.find('.container > .pgr'), {});
    dt.set_pager(pager);
    pager.widget('[page=2]').click();
    console.info("PAGER:", pager);
    console.log(work.html());

    expect(document.getElementById('work')).toMatchSnapshot();
});
