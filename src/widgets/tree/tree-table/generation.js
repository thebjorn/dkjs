
import {UIWidget} from "../../../widgetcore/ui-widget";
import {NodeList} from "./node-list";

/*
 *  A Generation is a panel in the TableTree widget.
 *  This widget controls the width and scrolling behavior of the TableTree
 *  widget.
 *
 *  The direct children of this widget are `dk.tree.NodeList` objects that
 *  represent the objects at this level in the tree. The children are created
 *  in the `nodelist()` method.
 *
 */
export class Generation extends UIWidget {
    constructor(...args) {
        super({
            type: 'dk-tree-generation',
            depth: undefined,
            selected: null,
            parent: null,    // parent in navigation context.
            tree: null,
            width: 100,
            css: {
                overflowY: 'scroll',
                overflowX: 'none',
                direction: 'rtl'
            },

            template: {
                root: 'div',
                table: '<table class="table xtable-condensed"/>'
            },
            
        }, ...args);
        this._nodelists = [];
    }

    construct() {
        this.widget().attr({generation: this.depth});
        this.widget().width(this.width);
    }

    draw(nodes) {
        // console.info("GENERATION:DRAW:NODES:", nodes);
        if (!nodes) return;
        this.nodelist(nodes);
    }

    nodelist(nodes, title) {
        if (!nodes) return;
        this.clear_nodelists();

        const cur_nodelist = NodeList.append_to(this.widget(), {
            title: title || this.tree.title,
            nodes: nodes,
            tree: this.tree,
            generation: this
        });

        this._nodelists.push(cur_nodelist);
        return cur_nodelist;
    }

    denavigate() {
        this._nodelists.forEach(nlist => nlist.denavigate());
        if (this.next) this.next.denavigate();
    }

    clear_nodelists() {
        this._nodelists.forEach(nlist => nlist.hide());
        if (this.next) this.next.clear_nodelists();
    }
}
