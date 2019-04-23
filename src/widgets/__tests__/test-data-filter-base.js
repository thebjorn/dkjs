import $ from 'jquery';
import page from "../../widgetcore/dk-page";
import {DataFilter} from "../data-filter";
import utidy from "../../browser/dk-html";


test("test-empty-data-filter", () => {
    document.body.innerHTML = `
        <div id="work"></div>
    `;
    const work = $('#work');
    page.initialize(document);

    const myfilter = DataFilter.create_inside(work, {
        filters: {}
    });
    console.info('filter.value:', myfilter.values());
    expect(myfilter.values()).toEqual({});
    console.log(work.html());

    expect(work.html()).toMatchSnapshot();

    // expect(utidy(work.html())).toEqual(utidy(`
    //     <section class="DataFilter" id="data-filter">
    //         <header id="dk-bx">
    //             <h2 class="title" id="dk-bx">
    //                 Filter
    //             </h2>
    //         </header>
    //         <div class="content" id="dk-bx">
    //         </div>
    //     </section>
    // `));
});
