
import dk from "../dk-obj";
import {Layout} from "./dk-layout";


export class TableRowLayout extends Layout {
    constructor(...args) {
        super(...args);
        this.class_name = 'dk-tr';
    }

    add_td() {
        const td = this.make('td');
        this.appendln(td);
        return td;
    }

    add_th() {
        const th = this.make('th');
        this.appendln(th);
        return th;
    }
}

/*
 *  Basic layout class for creating html tables.
 *
 *  <table>
 *      <thead></thead>
 *      <tfoot></tfoot>
 *      <tbody></tbody>
 *  </table>
 */
export class TableLayout extends Layout {
    constructor(widget, location, template, structure) {
        const default_structure = {  // default structure if not specified in the widget.
            thead: {},
            tfoot: {},
            tbody: {}
        };
        if (!widget.structure) widget.structure = default_structure;
        super(widget, location, template, structure || default_structure);
        this.class_name = 'dk-table';
    }

    construct() {
        // location is a <table/>
        this.location.addClass(this.class_name);
    }
    add_row_to(whence) {  // whence = {thead, tbody, tfoot}
        // console.info("WHENCE:", whence);
        const tr = this.make('tr');
        this.widget[whence].appendln(tr);
        return tr;
    }
    add_column_to(whence, kind, method, props) {
        const self = this;
        const cells = [];
        this.widget[whence].find('tr').each(function () {
            const cell = self.make(kind || 'td', props);
            dk.$(this)[method || 'append'](cell);
            cells.push(cell);
        });
        return cells;
    }
    add_column(method, props) {
        let cells = this.add_column_to('thead', 'th', method, props);
        cells = cells.concat(this.add_column_to('tbody', 'td', method, props));
        cells = cells.concat(this.add_column_to('tfoot', 'td', method, props));
        return cells;
    }
    get_cells(colnum, whence) {
        whence = whence || 'tbody';
        const cells = [];
        this.widget[whence].find('tr').each(function () {
            const cell = dk.$(this).find('td,th').eq(colnum);
            cells.push(cell);
        });
        return cells;
    }
    add_body_row() {
        return this.add_row_to('tbody');
    }
    add_header_row() {
        return this.add_row_to('thead');
    }
    add_footer_row() {
        return this.add_row_to('tfoot');
    }
    clear_body() {
        this.widget.tbody.empty();
    }
}


export class ResultsetLayout extends Layout {
    constructor(...args) {
        super(...args);
        this.class_name = 'dk-resultset';
        this.default_structure = {
            filter: {
                $PANEL: {}
            },
            data: {
                $PANEL: {}
            }
        };
    }
}
