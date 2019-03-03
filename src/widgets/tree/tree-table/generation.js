
import {UIWidget} from "../../../widgetcore/ui-widget";
import {NodeList} from "./node-list";

/*
 *  A Generation is a panel in the SelectTable widget.
 *  This widget controls the width and scrolling behavior of the SelectTable
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
                float: 'left',
                height: '100%',
                position: 'relative',
                overflowY: 'scroll',
                overflowX: 'none'
            },

            template: {
                root: 'div',
                table: '<table class="table xtable-condensed"/>'
            },
            
        }, ...args);
        this._nodelists = [];
    }

    denavigate() {
        this._nodelists.forEach(function (nlist) {
            nlist.denavigate();
        });
        if (this.next) this.next.denavigate();
    }

    clear_nodelists() {
        this._nodelists.forEach(function (nlist) {
            nlist.hide();
        });
        if (this.next) this.next.clear_nodelists();
    }

    nodelist(nodes, title) {
        if (!nodes) return;
        this.clear_nodelists();

        const nodelist = NodeList.append_to(this.widget(), {
            title: title,
            nodes: nodes,
            tree: this.tree,
            generation: this
        });

        this._nodelists.push(nodelist);
        return nodelist;
    }

    draw(nodes) {
        if (!nodes) return;
        this.nodelist(nodes);
    }

    construct() {
        this.widget().attr({generation: this.depth});
        this.widget().width(this.width);
    }
}
