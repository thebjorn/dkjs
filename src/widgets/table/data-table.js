/*
 *  A DataTable is the normal table representation of a DataSource,
 *  i.e. records in rows, with each field in its own column (with a column
 *  header).
 */

import dk from "../../dk-obj";
import {TableLayout} from "../../layout/table-layout";
import {Widget} from "../../widgetcore/dk-widget";
import {TableRow} from "./table-row";
import is from "../../is";
import {ColumnDef} from "./column-def";
import {TableHeader} from "./table-header";
import {DataSet} from "../../data/dk-dataset";
import {AjaxDataSource} from "../../data/source/dk-ajax-datasource";
import {dkwarning} from "../../lifecycle/coldboot/dkwarning";


export class DataTableLayout extends TableLayout {
    constructor(widget, location, template, structure) {
        super(widget, location, template, structure);
        this.thead_tr = this.add_header_row();
    }
    
    add_thead_th(attrs) {
        const th = this.make('thead_th', attrs);
        this.thead_tr.appendln(th);
        return th;
    }
}


export class DataTable extends Widget {
    constructor(...args) {
        super({
            // type: 'datatable',
            dklayout: DataTableLayout,
            TableRow: TableRow,
            current_pagenum: 0,
            translate: {},  // l10n

            structure: {
                thead: {},
                tfoot: {},
                tbody: {}
            },

            template: {
                root: 'table',
                table: '<table/>',
                thead: '<thead/>',
                thead_tr: '<tr/>',
                thead_th: '<th/>',
                tbody: '<tbody/>',
                tbody_tr: '<tr/>'
            },

            table_data: null,
            state: undefined,

            // The columns attribute should be a property object that defines the visible columns:
            //
            //      columns: {
            //          colnam1: {}
            //          colname2: {..}
            //      ..
            //
            // this.columns is converted to an array of dk.table.ColumnDef, and this.column to a
            // dict from column name to dk.table.ColumnDef.
            columns: null,
            column: {},

            filters: {},

            // should table be sortable?
            sortable: true,

            // selector of dom element to bless as a download link (e.g.
            // <a id="foo" data-download="filename.csv">download</a>
            // =>  download: '#foo',
            download: undefined,

            header: null,
            rows: null,

            column_order: null,
            column_defs: null,            
        }, ...args);

        const self = this;
        this.rows = [];
        this.header = [];   // th cell objects

        this.column = {};
        this.column_order = [];
        if (!!this.datasource && this.table_data === null) {
            const dsprops = {datasource: this.datasource};
            if (this.pagesize != null) dsprops.pagesize = this.pagesize;
            if (this.orphans != null) dsprops.orphans = this.orphans;
            if (this.pagenum != null) dsprops.pagenum = this.pagenum;
            this.table_data = new DataSet(dsprops);
        }
        if (this.table_data === null) {
            this.data_url = (this.dk && this.dk.url)? this.dk.url : "";
            //dk.info("URL", this.data_url);
            // if data is not defined, then create one
            this.table_data = new DataSet({
                // default data source is AjaxDataSource
                datasource: new AjaxDataSource({
                    // default url is current url
                    url: self.data_url
                })
            });
        }
        if (!this.data_url) this.data_url = this.table_data.datasource.url;

        //        this.state = dk.State.create({
        //            state: this.table_data.current_pagedef,
        //            engine: dk.HashStorage.create({})
        //        });
        //this.state.restore();
    }

    construct() {
        // this.state = dk.page.hash.substate(this.id);

        if (this.download) {
            const $download = dk.$(this.download);
            const filename = $download.attr('data-download') || 'filename.csv';
            dk.$(this.download).attr('href', this.data_url + "!get-records?fmt=csv&filename=" + filename);
        }
    }

    /*
     *  Connect to a pager widget.
     */
    set_pager(pwidget) {
        // const self = this;
        if (this.table_data.page) {
            pwidget.set_pagecount(this.table_data.page.recordset.meta.pagecount);
            pwidget.select_page(this.table_data.page.query.pagenum);
        }

        dk.on(pwidget, 'select-page', (...args) => this.table_data.get_pagenum(...args));
        dk.on(this.table_data, 'fetch-info', (info, query) => {
            pwidget.set_pagecount(info.pagecount);
            pwidget.select_page(query.pagenum);
        });
    }

    filter_values() {
        return {};
    }

    handlers() {
        //$(this.table_data).on('fetch-data', _.bind(this.draw, this));
        //$bind('fetch-data@data -> draw@me', {data: this.table_data, me: this});
        dk.on(this.table_data, 'fetch-data-start', () => this.start_busy());
        dk.on(this.table_data, 'fetch-data', (...args) => this.draw(...args));
        dk.on(this.table_data, 'fetch-data', (...args) => this.end_busy(...args));
    }

    set_sort(sortcol) {
        if (!sortcol.sortable) return;
        if (this.sortable) {
            this.header.forEach(function (col) {
                if (col.sortable && col !== sortcol) col.sort_icon.clear_sort();
            });
            sortcol.sort_icon.toggle_sort_direction();
            this.table_data.set_sort(sortcol.name, sortcol.sort_icon.direction);
            dk.trigger(this, 'sort-order', sortcol.name, sortcol.sort_icon.direction, this);
        }
    }

    set_search(terms) {
        this.table_data.set_search(terms);
        if (this.state) this.state.set('pagedef', this.table_data.current_pagedef);
    }

    set_filter(vals) {
        this.table_data.set_filter(vals);
    }

    get_xy(colnum, rownum) {
        return this.rows[rownum].cells[colnum];
    }

    set_xy(colnum, rownum, val, html, title) {
        const cell = this.get_xy(colnum, rownum);
        cell.set_value(val, html, title);
        return cell;
    }

    values() {
        const res = [];
        this.rows.forEach(function (row) {
            const r = [];
            row.cells.forEach(function (cell) {
                r.push(cell.widget().text());
            });
            res.push(r);
        });
        return res;
    }

    /*
     *  Convert this.columns to an array of basic property objects.
     *
     *    {foo: {label: 'Foo', ..}} ==> [{name: 'foo', label: 'Foo', ...}, ...]
     */
    _get_columndefs(fieldlst) {
        const self = this;
        let columndefs;
        const fields = {};  // field.name -> field
        fieldlst.forEach(function (f) { fields[f.name] = f; });

        // make sure this.columns is an array of pojos
        if (is.isFunction(this.columns)) columndefs = this.columns(this.table_data.fields);
        else if (this.columns === null) columndefs = fieldlst;
        else if (!Array.isArray(this.columns)) {
            // the columns property has been defined, convert it to array
            columndefs = Object.keys(this.columns).map(name => {
                const col = this.columns[name];
                col.name = name;
                return col;
            });
        } else {
            dkwarning(`Expected {field1: {...}, field2: {...}, etc.}. columns property of unknown type: ${this.columns}`);
        }

        // convert the pojos to ColumnDef objects
        return columndefs.map(function (coldef, colnum) {
            const field = fields[coldef.name];
            const tmp = {};
            if (field) {
                Object.assign(tmp, {
                    fieldpos: field.pos,
                    fieldtype: field.type,
                    sortable: field.sortable,
                    label: field.label,
                    help_text: field.help_text,
                    field_widget: field.widget,
                    field_data: field.data
                });
            }
            Object.assign(tmp, coldef);
            Object.assign(tmp, {
                colnum: colnum,
                table: self
            });
            if (tmp.sortable === undefined) {
                tmp.sortable = self.sortable;
            }
            const cdef = new ColumnDef(tmp);
            if (fields[cdef.name]) cdef.bind_to_field(fields[cdef.name]);
            self.column[cdef.name] = cdef;
            self.column_order.push(cdef.name);
            return cdef;
        });
    }

    /*
     *  Draw the column headers.
     */
    draw_header(dataset) {  // must be a separate method so VDataTable can inherit..
        if (!this.drawn_header) {
            const self = this;
            // NOTE: we have data here!
            this.columns = this._get_columndefs(dataset.page.fields);

            this.columns.forEach(function (coldef) {
                const th = TableHeader.create(self.layout.add_thead_th(), coldef);
                self.header.push(th);
            });
            self.drawn_header = true;  // only draw header once.
        }
    }

    draw(dataset) {
        const self = this;

        if (!dataset) {   // NOTE: data source consumer pattern..?  (on: data -> draw?)
            this.table_data.get_page({
                pagenum: this.current_pagenum
            });
        } else {
            self.draw_header(dataset);
            dk.trigger(self, 'draw-start', self);
            self.layout.clear_body();
            self.rows = [];

            dataset.page.records.forEach(function (record, rownum) {
                const tr = self.TableRow.create(self.layout.add_row_to('tbody'), {
                    rownum: rownum,
                    record: record,
                    table: self
                });
                self.rows.push(tr);
            });
            dk.trigger(self, 'draw-end', self);
        }
    }
}
