import $ from 'jquery';
import page from "../../widgetcore/dk-page";
import {DataFilter} from "../data-filter";
import utidy from "../../browser/dk-html";
import {ArraySource} from "../../data/source/dk-array-datasource";
import {DataSet} from "../../data/dk-dataset";



test("test-data-filter-multiple", () => {
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
    
    const ds = new DataSet({
        datasource: new MyArraySource([
            {f1: 'hello', f2: 42}
        ])
    });
    
    const myfilter = DataFilter.create_inside(work, {
        dataset: ds,
        filters: {
            my_filter: {
                label: 'My Label',
                // values: [1, 2, 3],
                select_multiple: true
            }
        },
        data: {
            set_filter: function (vals) {
                set_filter_vals = vals;
            }
        }
    });

    console.log(work.html());
    expect(gfd).toEqual('called');
    expect(work.html()).toMatchSnapshot();

    work.find(':checkbox:eq(0)').click();
    work.find(':checkbox:eq(1)').click();
    expect(set_filter_vals).toEqual({my_filter: {"1": 1, "2": 2}});

    // expect(utidy(work.html())).toEqual(utidy(`
    //
    // `));
});
