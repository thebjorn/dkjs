import $ from 'jquery';
import page from "../../../widgetcore/dk-page";
import {DataFilter} from "../data-filter";
import utidy from "../../../browser/dk-html";



test("test-data-filter-multiple", () => {
    document.body.innerHTML = `
        <div id="work"></div>
    `;
    const work = $('#work');
    page.initialize(document);
    let set_filter_vals = null;

    const myfilter = DataFilter.create_inside(work, {
        filters: {
            filter_name: {
                label: 'Filter Label',
                values: [1, 2, 3],
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
    expect(work.html()).toMatchSnapshot();

    work.find(':checkbox:eq(0)').click();
    work.find(':checkbox:eq(1)').click();
    expect(set_filter_vals).toEqual({filter_name: ["1", "2"]});

    // expect(utidy(work.html())).toEqual(utidy(`
    //
    // `));
});
