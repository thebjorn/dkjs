
import $ from "jquery";
import page from "../../../widgetcore/dk-page";
import {TreeWidget} from "../tree-list/tree-list";
import {JSonDataSource} from "../tree-data";


test("test-tree-list-2", () => {
    document.body.innerHTML = `
        <div id="work">
        </div>
    `;
    const work = $('#work');
    page.initialize(document);

    TreeWidget.create_inside(work, {
        data: JSonDataSource.create({
            "depth": 2,
            "height": 2,
            "cache": {
                "d329": {
                    "kind": "department",
                    "name": "Bar3",
                    "parent": "c57",
                    "id": "d329",
                    "path": [
                        "c57", "d329"
                    ],
                    "root": "c57",
                    "children": []
                },
                "c57": {
                    "kind": "company",
                    "name": "Bar1",
                    "parent": null,
                    "id": "c57",
                    "path": [
                        "c57"
                    ],
                    "root": "c57",
                    "children": ['d329', 'd328']
                },
                "d328": {
                    "kind": "department",
                    "name": "Bar2",
                    "parent": "c57",
                    "id": "d328",
                    "path": [
                        "c57", "d328"
                    ],
                    "root": "c57",
                    "children": []
                }
            },
            "roots": ['c57']
        })
    });

    expect(work.html()).toMatchSnapshot();
    // expect(utidy(work.html())).toEqual(utidy(`
    //     <div class="dktree panel panel-default" id="tree-widget">
    //         <div class="panel-body" id="dk-bx">
    //             <ul style="padding-left: 0px;" class="tree" id="dk-bx">
    //                 <li kind="company" nodeid="c57" class="dk-tree-list-tree tree company" id="tree">
    //                     <dk-icon value="plus-square-o:fw" class="icon" id="dk-bx"></dk-icon>
    //                     <span id="dk-bx">Bar1</span>
    //                     <ul style="display: none;" class="subtree" id="dk-bx">
    //                         <li kind="department" nodeid="d329" class="dk-tree-list-leaf leaf department" id="leaf">Bar3</li>
    //                         <li kind="department" nodeid="d328" class="dk-tree-list-leaf leaf department" id="leaf">Bar2</li>
    //                     </ul>
    //                 </li>
    //             </ul>
    //         </div>
    //     </div>        
    // `));
});
