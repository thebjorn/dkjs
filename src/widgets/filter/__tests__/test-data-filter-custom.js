import $ from 'jquery';
import dk from "../../../dk-obj";
import page from "../../../widgetcore/dk-page";
import {DataFilter} from "../data-filter";
import utidy from "../../../browser/dk-html";


test("test-data-filter-custom", () => {
    document.body.innerHTML = `
        <div id="work"></div>
    `;
    const work = $('#work');
    page.initialize(document);
    let set_filter_vals = null;

    const myfilter = DataFilter.create_inside(work, {
        filters: {
            smile: {
                label: 'Smil',
                xvalue: undefined,
                construct_filter(location, filter) {
                    const self = this;
                    const btn = $('<button/>').text(":-)");
                    const input = location.append(btn);
                    $(input).on('click', function () {
                        console.info("CLICK:EVENT:ON:SMILE:FILTER");
                        filter.value = "*SMILE*";
                        dk.trigger(filter, 'change', filter);
                    });
                    return input;
                }
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

    work.find('button').click();
    console.log("SET_FILTER_VALS:", set_filter_vals);
    expect(set_filter_vals).toEqual({ smile: '*SMILE*' });

    console.log('MYFILTER_VALUES:', myfilter.values());
    // expect(utidy(work.html())).toEqual(utidy(`
    //
    // `));
});
