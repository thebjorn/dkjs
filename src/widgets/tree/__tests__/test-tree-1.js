
import $ from 'jquery';
import page from "../../../widgetcore/dk-page";
import {TreeWidget} from "../tree-list/tree-list";
import {JSonDataSource} from "../tree-data";
import utidy from "../../../browser/dk-html";

/* 
 *  An empty tree should produce a panel with an empty `ul` tag.
 */
test("test-empty-tree-list", () => {
    document.body.innerHTML = `
        <div id="work"></div>
    `;
    const work = $('#work');
    page.initialize(document);

    TreeWidget.create_inside(work, {
        data: JSonDataSource.create({
            data: {}
        })
    });
    
    expect(work.html()).toMatchSnapshot();
    // expect(utidy(work.html())).toEqual(utidy(`
    //     <div class="dktree panel panel-default" id="tree-widget">
    //         <div class="panel-body" id="dk-bx">
    //             <ul style="padding-left: 0px;" class="tree" id="dk-bx"></ul>
    //         </div>
    //     </div>
    // `));
});


