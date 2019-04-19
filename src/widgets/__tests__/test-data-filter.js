import $ from 'jquery';
import page from "../../widgetcore/dk-page";
import {DataFilter} from "../data-filter";
import utidy from "../../browser/dk-html";


test("test-data-filter", () => {
    document.body.innerHTML = `
        <div id="work"></div>
    `;
    const work = $('#work');
    page.initialize(document);

    const myfilter = DataFilter.create_inside(work, {
        filters: {
            expires: {
                label: 'Utløper',
                values: [2013, 2014]
            },
            favyear: {
                label: 'Favorittår',
                values: [2013, 2014],
                select_multiple: true
            }
        }
    });
    console.info('filter.value:', myfilter.values());
    // expect(myfilter.values()).toEqual({
    //     expires: undefined,
    //     favyear: []
    // });
    console.log(utidy(work.html()));
    
    expect(utidy(work.html())).toEqual(utidy(`
        <section class="DataFilter" id="data-filter">
            <header id="dk-bx">
                <h2 class="title" id="dk-bx">Filter</h2>
            </header>
            <div class="content" id="dk-bx">
                <div class="SelectOneFilterDef" id="select-one-filter-def">
                    <div class="expires filterbox" id="dk-bx">
                        <header class="filterheader" id="dk-bx">
                            <h4 class="filtertitle" id="dk-bx">Utløper</h4>
                        </header>
                        <div id="dk-bx" class="RadioSelectWidget filter content filtercontent">
                            <label for="expires-1" id="expires-1-label"><input value="2013" id="expires" name="expires" type="radio">&nbsp;2013</label>
                            <label for="expires-2" id="expires-2-label"><input value="2014" id="expires" name="expires" type="radio">&nbsp;2014</label>
                        </div>
                    </div>
                </div>
                <div class="SelectMultipleFilterDef" id="select-multiple-filter-def">
                    <div class="favyear filterbox" id="dk-bx">
                        <header class="filterheader" id="dk-bx">
                            <h4 class="filtertitle" id="dk-bx">Favorittår</h4>
                        </header>
                        <div id="dk-bx" class="CheckboxSelectWidget filter content filtercontent">
                            <label for="favyear-1" id="favyear-1-label"><input value="2013" id="favyear" name="favyear" type="checkbox">&nbsp;2013</label>
                            <label for="favyear-2" id="favyear-2-label"><input value="2014" id="favyear" name="favyear" type="checkbox">&nbsp;2014</label>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `));
});
