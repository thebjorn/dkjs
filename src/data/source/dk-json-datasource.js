
import {DataSource} from "./dk-datasource-base";
import {sort_by} from "../utils";


export class JSONDataSource extends DataSource {
    constructor(props) {
        super();
        props = Object.assign({}, props);
        this.data = props.data || {};
        this._column_number = {};
    }
    _keymap() {
        // returns a mapping from primary key to row
        const res = {};
        this.data.rows.forEach(function (row) {
            res[row.k] = row;
        });
        return res;
    }

    _field_order() {
        const res = {};
        this.data.cols.forEach(function (col, i) {
            res[col.name] = i;
        });
        return res;
    }
    update(changes) {
        const keymap = this._keymap();
        const fieldmap = this._field_order();

        Object.keys(changes).forEach(function (pk) {
            const change = changes[pk];
            if (change.oldval === change.newval) return;

            const datarec = keymap[pk];
            Object.keys(change).forEach(function (fieldname) {
                datarec.c[fieldmap[fieldname]] = change.newval;
            });
        });
    }

    do_sort(request) {
        if (request.sort.length && request.sort[0].field) {
            if (request.sort[0].field) {
                this.data.rows = sort_by(this.data.rows, rec => {
                    const colval = rec.c[this._column_number[request.sort[0].field]];
                    return colval.v || colval.f || colval;
                });
                if (request.sort[0].direction === 'desc') {
                    this.data.rows.reverse();
                }
            }
        }
    }

    rows_to_records(request, rows, fields) {
        return rows.map(function (row, i) {
            const record = {
                pk: row.k,
                rownum: request.start + i
            };
            Object.keys(fields).forEach(function (fname, i) {
                record[fname] = row.c[i];
            });
            return record;
        });
    }

    /*
     *  Convert json data into a recordset for use with the widgets.
     *
     *  The meta property has the following components:
     *
     *    totcount:         the total number of records in the domain
     *    filter_count:     the number of records left after applying filters.
     *                      If filter_count == totcount then no filters have
     *                      been applied.
     *    start_recnum:     the first index of the returned records
     *    end_recnum:       the last index of the returned records
     *
     */
    _get_records(request, data) {
        const fields = this.get_fields(data);
        return {
            fields: fields,
            meta: data.info,
            records: this.rows_to_records(request, data.rows, fields)
        };
    }
    
    async fetch_records(request) {
        const p = this.get_defaults(request);
        this.data.info = {
            start_recnum: p.start,
            totcount: this.data.rows.length
        };
        this.do_sort(p);
        // filter data here..
        this.data.info.filter_count = this.data.rows.length;
        // slice data here..
        this.data.rows = this.data.rows.slice(p.start, p.end);
        return new Promise((resolve, reject) => {
            try {
                const res = this._get_records(request, this.data);
                resolve(res);
            } catch (e) {
                reject(e);
            }
        });
    }

    get_records(request, returns) {
        const p = this.get_defaults(request);
        this.data.info = {
            start_recnum: p.start,
            totcount: this.data.rows.length
        };
        this.do_sort(p);
        // filter data here..
        this.data.info.filter_count = this.data.rows.length;
        // slice data here..
        this.data.rows = this.data.rows.slice(p.start, p.end);
        returns(this._get_records(request, this.data));
    }
    get_fields(data) {
        // returned as part of _get_records(..)
        const self = this;
        const field_defs = {};
        if (!data || !data.cols) return [];
        data.cols.forEach(function (col, i) {
            self._column_number[col.name] = i;
            field_defs[col.name] = {
                name: col.name,
                pos: i,
                type: col.datatype,
                sortable: col.sortable,
                label: col.label,
                help_text: col.help_text,
                widget: col.widget,
                data: col.data
            };
        });
        return field_defs;
    }
}
