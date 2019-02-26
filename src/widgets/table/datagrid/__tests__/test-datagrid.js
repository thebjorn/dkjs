import $ from 'jquery';
import page from "../../../../widgetcore/dk-page";
import {DataGrid} from "../datagrid";
import {ArraySource} from "../../../../data/source/dk-array-datasource";
import utidy from "../../../../browser/dk-html";
import {jq_toggle_busy} from "../../../../browser/jquery-plugins";
import dk from "../../../../dk-obj";
import {_reset_counters} from "../../../../core/counter";


test("test-datagrid-render", () => {
    _reset_counters();
    document.body.innerHTML = `
        <div id="work">
            
        </div>
    `;
    const work = $('#work');
    page.initialize(document);

    DataGrid.create_inside(work);

    expect(document.getElementById('work')).toMatchSnapshot();
});


test("test-datagrid-1", () => {
    _reset_counters();
    document.body.innerHTML = `
        <div id="work">
            <div id="mydt-124">
                <table class="table table-bordered table-striped">
                </table>
            </div>
        </div>
    `;
    const work = $('#work');
    page.initialize(document);

    const mydt124 = DataGrid.create_inside('#mydt-124', {

        pagesize: 15,

        datasource: [
            {project: 'FOO-support', work: '1:11:11'},
            {project: 'Generelt NT', work: '2:22:11'},
            {project: 'Tiktok', work: '3:33:11'}
        ],

        columns: {
            work: {
                label: 'Arbeid' //,
                //format: (val) => { return val.replace(/:/g, '.'); }
            },
            project: {
                label: 'Prosjekt',
                format: function (val) {
                    return (val || '').toLowerCase();
                }
            }
        }
    });

    expect(document.getElementById('work')).toMatchSnapshot();
});


test("test-datagrid-2", () => {
    _reset_counters();
    document.body.innerHTML = `
        <div id="work">
            
        </div>
    `;
    const work = $('#work');
    page.initialize(document);
    jq_toggle_busy(dk);

    const mydt125 = DataGrid.create_inside(work, {
        datasource: ArraySource.create({
            data: [ {project: 'Tiktok', work: '3:33:11'} ]
        }),

        columns: {
            work: { label: 'Arbeid' },
            project: { label: 'Prosjekt' }
        }
    });
    work.find('td:first').click();
    console.info('first input', work.find('input:first')); //
    work.find('input:first').val('1:02:03').change();
    console.info("dirtyset:", mydt125.table_data.page.dirtyset);
    expect(Object.keys(mydt125.table_data.page.dirtyset)).toHaveLength(1);
    const dirtyrec = mydt125.table_data.page.dirtyset[0];
    
    // this.assert.equal(dirtyrec.work.oldval, '3:33:11', "model dirty oldval");
    expect(dirtyrec.work.oldval).toEqual('3:33:11');
    expect(dirtyrec.work.newval).toEqual('1:02:03');
    
    //dk.info('data page', mydt125.data.page);

    work.find('i.icon.save').click();
    expect(work.find('td:first').text()).toEqual('1:02:03');
    expect(mydt125.table_data.page.record[0].work).toEqual('1:02:03');
    
});
