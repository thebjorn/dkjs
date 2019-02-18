/*
 *  A DataTable is the normal table representation of a DataSource,
 *  i.e. records in rows, with each field in its own column (with a column
 *  header).
 */
// var dk = require('../../boot/boot');
// var Widget = require('../../widgetcore/dk-widget.js');
// var TableLayout = require('../../layout/dklayout').TableLayout;
// var TableRow = require('./dk-tablerow-widget.js');
// var TableHeader = require('./dk-tableheader-widget.js');
// var ColumnDef = require('./dk-columndef.js');
// var data = require('../../data');


import {TableLayout} from "../../layout/table-layout";
import {Widget} from "../../widgetcore/dk-widget";
import {TableRow} from "./table-row";

class DataTableLayout extends TableLayout {
    constructor(...args) {
        super({
            class_name: 'dk-datatable'
        }, ...args);
    }
    
    init(widget, location, template, structure) {
        this._super(widget, location, template, structure);
        this.thead_tr = this.add_header_row();
    }
    
    add_thead_th(attrs) {
        var th = this.make('thead_th', attrs);
        this.thead_tr.appendln(th);
        return th;
    }
}


class DataTable extends Widget {
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

            data: null,
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

        var self = this;
        this._super();
        this.rows = [];
        this.header = [];   // th cell objects

        this.column = {};
        this.column_order = [];
        if (!!this.datasource && this.data === null) {
            this.data = DataSet.create({
                datasource: this.datasource
            });
        }
        if (this.data === null) {
            this.data_url = (this.dk && this.dk.url)? this.dk.url : "";
            //dk.info("URL", this.data_url);
            // if data is not defined, then create one
            this.data = data.DataSet.create({
                // default data source is AjaxDataSource
                datasource: data.AjaxDataSource.create({
                    // default url is current url
                    url: self.data_url
                })
            });
        }
        if (!this.data_url) this.data_url = this.data.datasource.url;

        //        this.state = dk.State.create({
        //            state: this.data.current_pagedef,
        //            engine: dk.HashStorage.create({})
        //        });
        //this.state.restore();
    }

    construct() {
        // this.state = dk.page.hash.substate(this.id);

        if (this.download) {
            var $download = $(this.download);
            var filename = $download.attr('data-download') || 'filename.csv';
            $(this.download).attr('href', this.data_url + "!get-records?fmt=csv&filename=" + filename);
        }
        dk.on(this.data, 'fetch-data-start').run(this.FN('start_busy'));
        dk.on(this.data, 'fetch-data').run(this.FN('draw'));
        dk.on(this.data, 'fetch-data').run(this.FN('end_busy'));
    }

    /*
     *  Connect to a pager widget.
     */
    set_pager(pwidget) {
        // var self = this;
        if (this.data.page) {
            pwidget.set_pagecount(this.data.page.recordset.meta.pagecount);
            pwidget.select_page(this.data.page.query.pagenum);
        }

        dk.on(pwidget, 'select-page').run(this.data.FN('get_pagenum'));
        dk.on(this.data, 'fetch-info').run(function (info, query) {
            pwidget.set_pagecount(info.pagecount);
            pwidget.select_page(query.pagenum);
        });
    }

    filter_values() {
        return {};
    }

    handlers() {
        //$(this.data).on('fetch-data', _.bind(this.draw, this));
        //$bind('fetch-data@data -> draw@me', {data: this.data, me: this});

    }

    set_sort(sortcol) {
        if (!sortcol.sortable) return;
        if (this.sortable) {
            var self = this;
            self.header.forEach(function (col) {
                if (col.sortable && col !== sortcol) col.sort_icon.clear_sort();
            });
            sortcol.sort_icon.toggle_sort_direction();
            self.data.set_sort(sortcol.name, sortcol.sort_icon.direction);
            dk.publish(this, 'sort-order', sortcol.name, sortcol.sort_icon.direction, self);
        }
    }

    set_search(terms) {
        this.data.set_search(terms);
        if (this.state) this.state.set('pagedef', this.data.current_pagedef);
    }

    set_filter(vals) {
        this.data.set_filter(vals);
    }

    get_xy(colnum, rownum) {
        return this.rows[rownum].cells[colnum];
    }

    set_xy(colnum, rownum, val, html, title) {
        var cell = this.get_xy(colnum, rownum);
        cell.set_value(val, html, title);
        return cell;
    }

    values() {
        var res = [];
        this.rows.forEach(function (row) {
            var r = [];
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
        var self = this;
        var columndefs;
        var fields = {};  // field.name -> field
        fieldlst.forEach(function (f) { fields[f.name] = f; });

        // make sure this.columns is an array of pojos
        if (_.isFunction(this.columns)) columndefs = this.columns(this.data.fields);
        else if (this.columns === null) columndefs = fieldlst;
        else if (this.columns !== null && !_.isArray(this.columns)) {
            // the columns property has been defined, convert it to array
            columndefs = Object.keys(this.columns).map(function (name) {
                var col = self.columns[name];
                col.name = name;
                return col;
            });
        }

        // convert the pojos to ColumnDef objects
        return columndefs.map(function (coldef, colnum) {
            var field = fields[coldef.name];
            var tmp = {};
            if (field) {
                dk.update(tmp, {
                    fieldpos: field.pos,
                    fieldtype: field.type,
                    sortable: field.sortable,
                    label: field.label,
                    help_text: field.help_text,
                    field_widget: field.widget,
                    field_data: field.data
                });
            }
            dk.update(tmp, coldef);
            dk.update(tmp, {
                colnum: colnum,
                table: self
            });
            if (tmp.sortable === undefined) {
                tmp.sortable = self.sortable;
            }
            var cdef = ColumnDef(tmp);
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
            var self = this;
            // NOTE: we have data here!
            this.columns = this._get_columndefs(dataset.page.fields);

            this.columns.forEach(function (coldef) {
                var th = TableHeader.create(self.layout.add_thead_th(), coldef);
                self.header.push(th);
            });
            self.drawn_header = true;  // only draw header once.
        }
    }

    draw(dataset) {
        var self = this;

        if (!dataset) {   // NOTE: data source consumer pattern..?  (on: data -> draw?)
            this.data.get_page({
                pagenum: this.current_pagenum
            });
        } else {
            self.draw_header(dataset);
            dk.publish(self, 'draw-start', self);
            self.layout.clear_body();
            self.rows = [];

            dataset.page.records.forEach(function (record, rownum) {
                var tr = self.TableRow.create(self.layout.add_row_to('tbody'), {
                    rownum: rownum,
                    record: record,
                    table: self
                });
                self.rows.push(tr);
            });
            dk.publish(self, 'draw-end', self);
        }
    }
}
