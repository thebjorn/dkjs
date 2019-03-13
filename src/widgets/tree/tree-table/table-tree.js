
import {UIWidget} from "../../../widgetcore/ui-widget";
import {where} from "../../../collections";
import {Generation} from "./generation";

/*
 *  This is the top-most widget.
 *
 *  The get_selected() method returns the list of objects that are currently
 *  selected.  One or more objects can be selected depending on the
 *  multiselect attribute (default true).
 *
 *  The direct children of this widget are `dk.tree.Generation` objects
 *  that represent the panels of this widget. The children are created
 *  in the `draw()` method.
 *
 */

export class TableTree extends UIWidget {
    constructor(...args) {
        super({
            type: 'table-tree',
            title: 'MISSING-TITLE',
            item_height: 25,
            select: 'leaves',
            //cursor_children: "url(http://static.datakortet.no/cur/29.cur), pointer",
            //cursor_select: 'url(http://static.datakortet.no/cur/71.cur), pointer',
            selected: null,
            target: null,
            selectable: [],
            multiselect: true,
            values: null,
            //_tree_cache: {},
            _generation: null,
            current_node: null,
            _selected_nodes: null,
            size: 5,

            structure: {
                classes: ['dk-tree-select'],
                css: {
                    display: 'flex',
                }
            },
        }, ...args);
        if (typeof this.selectable === 'string') {
            this.selectable = this.selectable === ''? null: this.selectable.split(',');
        }
        if (typeof this.multiselect === 'string') {
            this.multiselect = (this.multiselect === '1');
        }
        this.values = {};
        this._generation = [];
        this._selected_nodes = [];
    }
    
    construct() {
        this.widget().height(this.size * this.item_height);
    }

    get_selected() {
        if (! (this.data || this.data.cache)) return {};
        return where(this.data.cache, {selected: true});
    }

    selection_state(node, boolval) {
        if (boolval && !this.multiselect) {
            // if we're selecting a new node in single-select mode,
            // remove all other selections.
            this._selected_nodes.forEach(function (snode) {
                snode.selection_state(false);
            });
            this._selected_nodes.length = 0;  // clear array
        }
        if (boolval && !this._selected_nodes.includes(node)) {
            this._selected_nodes.push(node);
        }
        if (!boolval) {
            const _pos = this._selected_nodes.indexOf(node);
            if (_pos !== -1) this._selected_nodes.splice(_pos, 1);
        }
        node.selection_state(boolval);
    }

    navigate_to(node) {
        if (this.current_node !== node) {
            // deselect current node.
            if (this.current_node !== null) {
                this.current_node.navigation_state(false);
            }
            this.current_node = node;
            node.navigation_state(true);
            node.widget().focus();
        }
    }

    draw(data) {
        const self = this;
        data = data || this.data;
        for (let i=0; i<data.depth; i++) {
            const generation = Generation.append_to(this.widget(), {
                depth: i,
                title: this.title,
                selected: null,
                width: Math.floor((self.widget().innerWidth() - 0.5) / data.depth),
                tree: self
            });
            this._generation.push(generation);
            if (i > 0) this._generation[i - 1].next = generation;
        }
        console.info("ROOTS:", this.data.roots);
        if (true || this.data.depth > 0) {
            this._generation[0].parent = this;
            this._generation[0].draw(this.data.roots);
        }
    }
}
