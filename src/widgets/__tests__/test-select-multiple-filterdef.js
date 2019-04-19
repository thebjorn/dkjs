import $ from "jquery";
import page from "../../widgetcore/dk-page";
import {SelectMultipleFilterDef} from "../data-filter";
import utidy from "../../browser/dk-html";


test("test-select-multiple-filterdef", () => {
    document.body.innerHTML = `
        <div id="work"></div>
    `;
    const work = $('#work');
    page.initialize(document);

    const sofd = SelectMultipleFilterDef.create_inside(work, {
        name: 'myname',
        label: 'My Label',
        values: [1, 2, 3]
    });

    //
    // expect(utidy(work.html())).toEqual(utidy(`
    //
    // `));
    // console.log(work.html());
    // expect(work.html()).toMatchSnapshot();

    expect(sofd.value).toEqual({});

    work.find(':checkbox:eq(0)').click();
    expect(sofd.value).toEqual({"1": 1});

    work.find(':checkbox:eq(1)').click();
    expect(sofd.value).toEqual({"1": 1, "2": 2});

});
