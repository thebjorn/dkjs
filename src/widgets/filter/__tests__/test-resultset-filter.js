import $ from "jquery";
import page from "../../../widgetcore/dk-page";
import {PanelWidget} from "../../dk-panel";
import {ResultSet} from "../../table/resultset/resultset";
import {DataTable} from "../../table/data-table";
import {DataSet} from "../../../data/dk-dataset";
import {DataFilter} from "../data-filter";
import utidy from "../../../browser/dk-html";
import {ArraySource} from "../../../data/source/dk-array-datasource";


test("resultset-filter-options", () => {
    document.body.innerHTML = `
        <div id="work"></div>
    `;
    const work = $('#work');
    page.initialize(document);
    
    let set_filter_vals = null;
    let gfd = null;

    class MyArraySource extends ArraySource {
        get_filter_data(filter_name, returns) {
            gfd = 'called';
            returns({
                options: [1, 2, 3]
            });
        }
    }
    
    const ds = new MyArraySource([
        {f1: 'hello', f2: 42}
    ]);

    const dset = new DataSet({
        datasource: ds
    });
    

    class ProgressResultFilterPanel extends PanelWidget {
        constructor(...args) {
            console.log("ProgressResultFilterPanel", args);
            super({
                direction: 'left',
                title: 'Filter',
                dataset: null,
            }, ...args);
            console.log('progresfiltpan:', this.datasource, this.dataset);
        }

        construct_panel_body(body) {
            const self = this;
            const filterbox = $('<div/>');
            body.append(filterbox);

            this.datafilter = DataFilter.create_on(filterbox, {
                structure: {
                    content: {}
                },
                dataset: self.dataset,
                filters: {
                    testcenter: {
                        label: 'Testsenter',
                        select_multiple: true,
                    }
                }
            });
            return body;
        }
    }


    ResultSet.create_on(work, {
        construct_filter: function (location, dataset) {
            // return DataFilter.create_on(location, {
            //     structure: {
            //         content: {}
            //     },
            //     datasource: ds,
            //     filters: {
            //         testcenter: {
            //             label: 'Testsenter',
            //             select_multiple: true,
            //             // values: [1,2,3]
            //             // url: './!get-testcenter-values'
            //         }
            //     }
            // });
            return ProgressResultFilterPanel.create_on(location, {
                // datasource: ds,
                dataset: dataset
            });
        },

        construct_table: function (location, downloadwidget) {
            console.info("constructing table...", location, downloadwidget);
            return DataTable.create_on(location, {
                classes: ['table table-bordered table-hover table-condensed'],
                download: downloadwidget,

                table_data: new DataSet({
                    pagesize: 20,
                    datasource: ds
                }),
                columns: {
                    pk: {}
                }
            });
        }
    });

    expect(utidy(work.html())).toEqual(utidy(`

    `));
});
