
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
                classes: ['dk-tree-nodelist', 'table', 'table-condensed'],
                css: {
                    width: '100%'
                },
                thead: {},
                tbody: {}
            },
            template: {root: 'table'},
        }, ...args);
    }

    construct() {
        const self = this;
        this.header_row = this.layout.add_row_to('thead');
        const th = this.layout.make('th', {colspan: 3, height:20});
        th.text(this.title);
        this.header_row.appendln(th);

        this._nodes = [];
        // console.info("CONSTRUCTING:NODELIST:NODES:", this.nodes);

        this.nodes.forEach(node => {
            const tr = this.layout.add_row_to('tbody');
            // console.info("NODEID:", node.id);

            this._nodes.push(Node.create_on(tr, {
                item: this.tree.tree_data.cache[node.id],
                tree: this.tree,
                generation: this.generation,
                nodelist: this
            }));
        });
    }

    denavigate() {
        this._nodes.forEach(node => node && node.navigation_state(false));
    }

    show() {
        super.show();
        this._nodes.forEach(function (node) {
            node.hilite();
        });
    }
}
