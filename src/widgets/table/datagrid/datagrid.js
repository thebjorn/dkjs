import dk from "../../../dk-obj";
import {DataTable} from "../data-table";
import {DataGridRow} from "./datagrid-row";
import {dkconsole} from "../../../lifecycle/dkboot/dk-console";

/*
    A datagrid is a data table that can update its data source.
 */
export class DataGrid extends DataTable {
    constructor(...args) {
        super({
            // type: 'datagrid',
            TableRow: DataGridRow,
            commands: ['save', 'remove', 'cancel'],

        }, ...args);
    }

    save() {
        this.table_data.update();     // update datasource
    }

    add_dirty(record, coldef, newval, oldval, widget) {
        this.table_data.page.add_dirty(
            record.pk,
            coldef.field,
            newval,
            oldval,
            widget
        );
    }

    start_editing(row) {
        const self = this;
        if (this.editing) return false;
        this.editing = true;

        dk.$('body')
            .on('keyup.editing', function (e) {
                if (e.keyCode === 27) {
                    row.undo_editing();
                    self.stop_editing();
                }
            })
            .on('click.editing', function () {
                row.undo_editing();
                self.stop_editing();
            });

        this._edit_row = row;
        const cells = this.layout.add_column('append');
        this._command_cells = cells;
        this.widget().addClass('editing');
        cells.forEach(function (cell) {
            cell.css({
                border: 'none !important',
                backgroundColor: 'transparent !important'
            });
        });
        //cells.shift();
        const cell = cells[row.rownum + 1];
        row.add_command_cell(cell);
        return true;  // can edit row
    }

    stop_editing() {
        dk.$('body').off('.editing');
        this._edit_row.stop_editing();
        this._command_cells.forEach(function (cell) {
            cell.remove();
        });
        this._edit_row = null;
        this._command_cells = null;
        this.widget().removeClass('editing');
        this.editing = false;
        this.trigger('stop-editing', this);
        dkconsole.info("Table stop editing", 5);
    }

}
