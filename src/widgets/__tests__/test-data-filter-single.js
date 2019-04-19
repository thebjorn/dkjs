import $ from 'jquery';
import page from "../../widgetcore/dk-page";
import {DataFilter} from "../data-filter";
import utidy from "../../browser/dk-html";



test("test-data-filter-single", () => {
    document.body.innerHTML = `
        <div id="work"></div>
    `;
    const work = $('#work');
    page.initialize(document);

    const myfilter = DataFilter.create_inside(work, {
        filters: {
            filter_name: {
                label: 'Filter Label',
                values: [1, 2, 3]
            }
        }
    });
    
    console.log(work.html());
    expect(work.html).toMatchSnapshot();
    // expect(utidy(work.html())).toEqual(utidy(`
    //    
    // `));
});
