import $ from 'jquery';
import page from "../../../widgetcore/dk-page";
import {SelectOneFilterDef} from "../filter-defs";


test("test-select-one-filterdef", () => {
    document.body.innerHTML = `
        <div id="work"></div>
    `;
    const work = $('#work');
    page.initialize(document);
    
    const sofd = SelectOneFilterDef.create_inside(work, {
        name: 'myname',
        label: 'My Label',
        values: [1, 2, 3]
    });
    
    console.log(work.html());
    expect(work.html()).toMatchSnapshot();
    
    expect(sofd.value).toEqual([]);
    
    work.find(':radio:eq(0)').click();
    expect(sofd.value).toEqual(["1"]);

    work.find(':radio:eq(1)').click();
    expect(sofd.value).toEqual(["2"]);

    // expect(utidy(work.html())).toEqual(utidy(`
    //
    // `));
});
