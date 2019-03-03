
import {DataTable} from "../data-table";
import {TableHeader} from "../table-header";
import {TableColumn} from "./record";
import {TableLayout} from "../../../layout/table-layout";
import {cls2pojo} from "../../../sys/cls2pojo";


class VDataTableLayout extends TableLayout {
    constructor(widget, location, template, structure) {
        super(widget, location, template, structure);
        this.class_name = 'dk-vdatatable';
    }
}


/*
 *  A V(ertical) Data Table is a datatable where the headers are
 *  on the left instead of the top.
 */
export class VDataTable extends DataTable {
    constructor(...args) {
        super({
            type: 'vdatatable',
            dklayout: VDataTableLayout,
        }, ...args);
    }

    draw(dataset) {
        const self = this;

        if (!dataset) {
            this.table_data.get_page({
                pagenum: 0,
                page_size: 0
            });
        } else {
            // now convert this.columns to an array of ColumnDef, blessing them with
            // some extra knowledge..
            this.columns = this._get_columndefs(dataset.page.fields);

            this.columns.forEach(function (coldef) {
                coldef.sortable = false;  // v data tables are not sortable.

                const tr = self.layout.add_row_to('tbody');
                const th = TableHeader.create_inside(
                    tr,
                    cls2pojo(coldef));
                self.columns.push(th);
            });

            dataset.page.records.forEach(function (record, rownum) { //rownum, pk, columndata) {
                const cells = self.layout.add_column_to('tbody');
                self.rows.push(TableColumn.create(cells[0], {
                    rownum: rownum,
                    record: record,
                    table: self
                }));
            });
        }
    }

}
