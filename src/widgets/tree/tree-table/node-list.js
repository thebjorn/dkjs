
import {UIWidget} from "../../../widgetcore/ui-widget";
import {TableLayout} from "../../../layout/table-layout";
import {Node} from "./tree-node";

/*
 *  A NodeList contains all the elements of the tree at this level.
 */

export class NodeList extends UIWidget {
    constructor(...args) {
        super({
            type: 'treeselect-nodelist',
            title: '',
            nodes: [],
            tree: null,
            generation: null,
            dklayout: TableLayout,
            structure: {
                classes: ['dk-tree-nodelist'],
                css: {
                    width: '100%'
                },
                thead: {},
                tbody: {}
            },
            template: {root: 'table'},
        }, ...args);
    }

    denavigate() {
        this._nodes.forEach(function (node) {
            node.navigation_state(false);
        });
    }

    show() {
        this._super();
        this._nodes.forEach(function (node) {
            node.hilite();
        });
    }

    construct() {
        const self = this;
        this.header_row = this.layout.add_row_to('thead');
        const th = this.layout.make('th', {colspan: 3, height:20});
        th.text(this.title);
        this.header_row.appendln(th);

        this._nodes = [];

        this.nodes.forEach(function (nodeid) {
            const tr = self.layout.add_row_to('tbody');

            self._nodes.push(new Node(tr, {
                item: self.tree.data.cache[nodeid],
                tree: self.tree,
                generation: self.generation,
                nodelist: self
            }));
        });
    }
}
