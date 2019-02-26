
import dk from "../../../dk-obj";
import {TableRow} from "../table-row";
import {icon} from "../../dk-icon-library";


/*
 *  A Table row in a data grid.
 */
export class DataGridRow extends TableRow {
    constructor(...args) {
        super({
            // type: 'DataGridRow',
            editing: false,
            command_cell: null,
        }, ...args);
    }

    start_editing(e) {
        e.stopPropagation();
        if (this.editing) return;
        if (!this.table.start_editing(this)) return;  // prevent editing multiple rows
        this.editing = true;
        this.widget().toggle_busy(true);
        this.cells.forEach(cell => {
            cell.start_editing();
            dk.on(cell, 'dirty', (coldef, newval, widget, oldval) => {
                const record = this.record;
                this.table.add_dirty(record, coldef, newval, oldval, widget);
            });
        });
        this.widget('input:first').focus();
        this._save_box_shadow = this.widget().css('box-shadow');
        this.widget().css('box-shadow', '0 0 5px 5px rgba(100,100,100,.2)');
        this.widget().toggle_busy(false);
    }

    stop_editing() {
        this.cells.forEach(function (cell) {
            cell.stop_editing();
        });
        this.widget().css('box-shadow', this._save_box_shadow);
        this.editing = false;
    }

    save_editing() {
        this.cells.forEach(function (cell) {
            cell.save_editing();
        });
        this.table.save();
    }

    undo_editing() {
        this.cells.forEach(function (cell) {
            cell.undo_editing();
        });
    }

    add_command_cell(cell) {
        const self = this;
        this.command_cell = cell;

        const cmd = function (command, color, method) {
            const cmdtxt = (self.table.translate && self.table.translate[command] !== undefined) ? self.table.translate[command] : command;
            const btn = dk.$('<button/>').addClass('btn btn-xs btn-default');
            btn
                .append(icon(command, {cursor: 'pointer', color: color}))
                .append('&nbsp;' + cmdtxt)
                .attr('title', cmdtxt)
                .css({marginLeft: '2px'})
                .click(function (e) {
                    e.preventDefault();
                    self[method]();
                    self.table.stop_editing();
                    return false;
                });

            cell.append(btn);
        };

        if (this.table.commands.includes('save'))   cmd("save", "green", "save_editing");
        if (this.table.commands.includes('remove')) cmd("remove", "#ec520f", "");
        if (this.table.commands.includes('cancel')) cmd("cancel", "#ccc", "undo_editing");

        this.trigger('add-command-cell', cell);
    }

    handlers() {
        this.widget().on('click', (e) => this.start_editing(e));
    }
}
