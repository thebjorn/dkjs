
import $ from 'jquery';
import {TableTree} from "../table-tree";
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

    const tree = TableTree.create_inside(work, {
        selectable: ['department', 'company'],
        multiselect: false,
        tree_data: JSonDataSource.create({
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
    // console.log("WORK:", work.html());
    $('[name=Bar1] .treeselect-node').click();
    const selected = tree.get_selected();
    expect(selected).toHaveLength(1);
    expect(selected[0].id).toBe("c57");
    expect(work.html()).toMatchSnapshot();
});
