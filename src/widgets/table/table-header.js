

import dk from "../../dk-obj";
import {TableCell} from "./table-cell";
import {Widget as SortDirection} from "../../widgetcore/dk-widget";
import {cursor} from "../cursors";


/*
 *  Column header widget.
 */
export class TableHeader  extends TableCell {
    constructor(...args) {
        super({
            scope: 'col',
            width: undefined,
            sortable: true,

            name: undefined,
            label: undefined,
            title: undefined,
            format: undefined,
            field: undefined,
            table: undefined,

            template: {root: 'th'},

        }, ...args);
    }
    

    construct() {
        if (this.sortable) {
            this.sort_icon = SortDirection.create_inside(this.widget(), {
                width: '2ex'
            });
        }
        this.title = this.description;
    }

    handlers() {
        const self = this;
        if (this.sortable) {
            self.widget().on('click', function () {
                self.table.set_sort(self);
            });
            // $bind('sort@icon -> set_sort_cursor@me', {icon:this.sort_icon, me: this});
            dk.on(this.sort_icon, 'sort', this.FN('set_sort_cursor'));
        }
    }

    set_sort_cursor() {
        if (this.sortable) {
            const _cursor = this.sort_icon.direction === 'desc' ? 'down' : 'up';
            this.widget().css('cursor', cursor(_cursor));
            this.table.notify('sort', this.sort_icon.direction);
        }
    }

    draw() {
        this.widget().attr({
            title: this.title,
            scope: this.scope,
            fieldname: this.name
        }).append(this.label);
        if (this.sortable) this.set_sort_cursor();
    }
}
