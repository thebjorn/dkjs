
import {UIWidget} from "../../../widgetcore/ui-widget";
import {TableCell} from "../table-cell";

export class TableColumn extends UIWidget {
    constructor(...args) {
        super({
            type: 'vTableColumn',
            rownum: null,
            record: null,
            table: null,
            cells: [],
        }, ...args);
    }
    
    draw() {
        const self = this;
        const cells = this.table.layout.get_cells(this.rownum + 1);  // skip header row

        this.cells = self.table.column_order.map(function (fname, i) {
            return TableCell.create_on(cells[i], {
                cell_value: self.record[fname],
                // tablerow: self,
                coldef: self.table.column[fname]
            });
        });
    }
}
