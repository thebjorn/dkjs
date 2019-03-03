
import $ from "jquery";
import page from "../../../widgetcore/dk-page";
import {TreeWidget} from "../tree-list/tree-list";
import {JSonDataSource} from "../tree-data";


test("test-single-node-tree-list", () => {
    document.body.innerHTML = `
        <div id="work">
            <div class="container"></div>
        </div>
    `;
    const work = $('#work');
    page.initialize(document);

    TreeWidget.create_inside(work.find('.container'), {
        data: JSonDataSource.create({
            depth: 1,
            height: 1,
            roots: ['c57'],
            cache: {
                c57: {
                    "kind": "company",
                    "name": "Spareskillingsbanken",
                    "parent": null,
                    "id": "c57",
                    "path": [],
                    "root": null,
                    "children": []
                },
            }
        })
    });

    expect(work.html()).toMatchSnapshot();
    // expect(utidy(work.html())).toEqual(utidy(`
    //     <div class="container">
    //         <div class="dktree panel panel-default" id="tree-widget">
    //             <div class="panel-body" id="dk-bx">
    //                 <ul style="padding-left: 0px;" class="tree" id="dk-bx">
    //                     <li kind="company" nodeid="c57" class="dk-tree-list-tree tree company" id="tree">
    //                         <dk-icon value="square-o:fw" class="icon" id="dk-bx"></dk-icon>
    //                         <span id="dk-bx">Spareskillingsbanken</span>
    //                         <ul style="display: none;" class="subtree" id="dk-bx"></ul>
    //                     </li>
    //                 </ul>
    //             </div>
    //         </div>
    //     </div>
    // `));
});
