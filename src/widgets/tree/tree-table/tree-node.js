
import dk from "../../../dk-obj";
import {UIWidget} from "../../../widgetcore/ui-widget";


export class Node extends UIWidget {
    constructor(...args) {
        super({
            type: 'tree-node',
            item: null,
            tree: null,
            generation: null,
            nodelist: null,

            //cursor_children: "url(http://static.datakortet.no/cur/29.cur), pointer",
            cursor_children: "pointer",
            //cursor_select: 'url(http://static.datakortet.no/cur/71.cur), pointer',
            cursor_select: 'pointer',
            
        }, ...args);
    }
  
    have_children() {
        return this.item.children.length > 0;
    }

    selectable() {
        return (
            this.tree.selectable === null ||
            this.tree.selectable.includes(this.item.kind)
        );
    }

    widget_selected_state(boolval) {
        if (this.input && this.selectable()) {
            if (this.input) {
                const input = this.input.find('input');
                input.prop('checked', boolval);
            }
            this.item.selected = boolval;
        }
    }

    selection_state(boolval) {
        this.item.selected = boolval;
        this.widget_selected_state(boolval);
        this.hilite(boolval);
    }

    hilite(boolval) {
        if (boolval === undefined) boolval = this.item.selected;
        if (boolval) {
            this.widget().addClass('nav-selected');
        } else {
            this.widget().removeClass('nav-selected');
        }
    }

    /*
     *  Navigate to, or away from, this node.
     */
    navigation_state(boolval) {
        if (boolval) {
            this.generation.denavigate();
            this.draw_children();
        }
        this.hilite(boolval);
    }

    draw_input() {
        if (this.input && this.selectable()) {
            const input = this.layout.make('input', {
                name: this.item.kind,
                value: this.item.id,
                type: this.tree.multiselect ? 'checkbox' : 'radio'
            });
            input.css({
                margin: 4,
                cursor: this.cursor_select
            });
            this.input.append(input);
            if (this.item.selected) {
                input.checked = 'checked';
            }
        }
    }

    set_cursor() {
        this.widget().css({
            cursor: (!this.have_children()) ? this.cursor_select : this.cursor_children
        });
    }

    draw() {
        this.widget()
            .attr({name: this.item.name})
            .addClass(this.item.kind)
            .addClass((!this.have_children()) ? 'treeselect-leaf' : 'treeselect-tree');

        this.draw_input();
        this.cell.text(this.item.name);
        this.set_cursor();

        if (this.have_children()) {
            this.icon.append(dk.icon('chevron-right'));
        }
    }

    draw_children() {
        if (this._childnode_cache) {
            // dk.info('has child-cache');
            this.generation.next.clear_nodelists();
            this._childnode_cache.show();
        } else {
            this.generation.next.clear_nodelists();
            this._childnode_cache = this.generation.next.nodelist(this.item.children, this.item.name);
        }
    }

    handlers() {
        const self = this;
        this.widget().on('click', function () {
            // navigate or (de-)select?
            if (self.have_children()) {  // can navigate to here
                if (self.tree.current_node !== self) {
                    // not enough to check nav-selected since we'll also have
                    // that class if one of our descendants is selected.
                    // dk.info("navigate_to          3");
                    self.tree.navigate_to(self);
                }
            }
            if (self.selectable()) {
                self.tree.selection_state(self, !self.item.selected);
            }
        });
        if (this.input) {
            this.input.find('input').on('click', function (e) {
                self.widget().click();
                e.stopPropagation();
                return false;
            });
        }
    }

    construct() {
        this.widget().addClass('treeselect-item');
        if (this.tree.selectable !== null) {
            this.input = this.layout.make('td').addClass('treeselect-input');
            this.input.css({
                textAlign: 'center',
                verticalAlign: 'middle'
            });
        }
        this.cell = this.layout.make('td').addClass('treeselect-node');
        this.icon = this.layout.make('td', {valign: 'middle'}).addClass('treeselect-icon');
        if (this.input) this.layout.appendln(this.input);
        this.layout.appendln(this.cell);
        this.layout.appendln(this.icon);
    }
}
