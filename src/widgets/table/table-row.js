
/*
 *  A Data Record widget.
 */
// const Widget = require('../../widgetcore/dk-widget.js');
// const TableCell = require('./dk-tablecell-widget.js');
// const layout = require('../../layout/dklayout');


import {Widget} from "../../widgetcore/dk-widget";
import {TableCell} from "./table-cell";
import {TableRowLayout} from "../../layout/table-layout";


export class TableRow extends Widget {
    constructor(...args) {
        super({
            dklayout: TableRowLayout,
            rownum: null,
            record: null,
            table: null,
            cells: [],
            template: {root: 'tr'},
        }, ...args);
    }
    
    
    construct() {
        const record = this.record;
        const table = this.table;
        this.widget().attr({
            pk: record.pk,
            rownum: this.rownum
        });
        this.cells = table.column_order.map(fname => {
            const coldef = table.column[fname];
            return TableCell.create(this.layout.add_td(), {
                tablerow: this,
                coldef: coldef
            });
        });
    }

    get_column_value(coldef) {
        return coldef.get_value(this.record);
    }
    set_column_value(coldef, val) {
        this.record[coldef.name] = val;
    }
}
