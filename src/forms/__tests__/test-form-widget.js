import {TextInputWidget} from "../widgets";
import $ from "jquery";
import page from "../../widgetcore/dk-page";
import {ArraySource} from "../../data/source/dk-array-datasource";
import {DataSet} from "../../data/dk-dataset";


// function debug_item(v) {
//     console.log(v);
//     console.dir(v);
//    
// }
//
// function debug_work_item(w) {
//     // console.log("W:HTML:", w.html());
//     // console.log("W:EACH:HTML:");
//     const children = w.find('> *');
//     console.log("FOUND:", children.length, "CHILDREN");
//     // if (children.length === 0) return;
//    
//     if (children.length > 1) {
//         children.each(function (i, item) {
//             debug_item(item);
//         });
//     } else {
//         debug_item(w);
//     }
// }


test("test-ds-formwidget", () => {
    document.body.innerHTML = `<div id="work"></div>`;
    const work = $('#work');
    page.initialize(document);
    
    const ds = new DataSet({
        datasource: [
            {f: 'a'},
            {f: 'b'},
            {f: 'c'},
        ]
    });
    
    const w = TextInputWidget.create_inside(work, {
        value: ds[1].f
    });

    console.log(work.html());
    // debug_work_item(work.find('.TextInputWidget'));
    console.log(w.toString());
    // console.log(w);
    
    expect(work.html()).toEqual("");
});
