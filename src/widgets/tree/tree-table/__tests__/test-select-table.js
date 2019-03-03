
import $ from 'jquery';
import {SelectTable} from "../select-table";
import page from "../../../../widgetcore/dk-page";
import utidy from "../../../../browser/dk-html";
import {Forrest, JSonDataSource} from "../../tree-data";



test("test-select-table-render", () => {
    document.body.innerHTML = `
        <div id="work">
        </div>
    `;
    const work = $('#work');
    page.initialize(document);

    SelectTable.create_inside(work, {
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
    console.log(work.html());
    expect(utidy(work.html())).toEqual(utidy(`
        <div id="select-table-1" class="treeselect dk-tree-select" style="height: 411px; overflow-y: hidden; border: 1px solid #e0e0e0; position: relative;">
            <div id="generation-1" class="dk-tree-generation" style="float: left; height: 100%; position: relative; overflow-y: scroll; overflow-x: none; width: 0px;" generation="0">
                <table id="node-list-1" class="treeselect-nodelist dk-tree-nodelist dk-bx" style="width: 100%;">
                    <thead id="dk-bx-1">
                        <tr id="dk-table-1">
                            <th colspan="3" style="height: 20px;" id="dk-table-2"></th>
                        </tr>
                    </thead>
                    <tbody id="dk-bx-2">
                        <tr id="dk-table-3"></tr>
                    </tbody>
                </table>
            </div>
            <div id="generation-2" class="dk-tree-generation" style="float: left; height: 100%; position: relative; overflow-y: scroll; overflow-x: none; width: 0px;" generation="1">
            </div>
        </div>
    `));
});
