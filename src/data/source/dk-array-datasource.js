
/*
 *  Use an array of pojos as a data source.
 *
 *  Usage::
 *
 *      const ds = dk.data.ArraySource.create({
 *          data: [
 *              {project: 'Generelt NT', work: '1:03:57'},
 *              {project: 'Tiktok',      work: '2:44:57'},
 *              {project: 'AFR-support', work: '1:06:43'}
 *          ]
 *      });
 */
import {DataSource} from "./dk-datasource-base";
import {sort_by} from "../utils";


export class ArraySource extends DataSource {
    constructor(arr) {
        super();

        if (Array.isArray(arr)) {
            // ArraySource([ {..}, {..}, ..])
            this.data = arr;
        } else {
            // ArraySource({ data: [..]})
            this.data = arr.data;
        }
        // data source items need to have a key
        this.data.map(function (item, i) {
            item.pk = item.pk || i;
        });
    }

    /*
     *  Update the data source with `changes`.
     *
     *  `changes` is a dict with the following shape::
     *
     *      {
     *          <primary-key>: {
     *              <field-name>: {oldval: a, newval: b}
     *              <field-2>: ...
     *          }, ...
     *      }
     *
     *   the data source should unconditionally save changes to all the specified
     *   fields, but only to the records/fields that have changes.
     */
    update(changes) {
        const self = this;
        Object.keys(changes).forEach(function (pk) {
            const change = changes[pk];
            const datarec = self.data[pk];
            for (const attr in change) if (attr !== 'pk' && change.hasOwnProperty(attr)) {
                datarec[attr] = change[attr].newval;
            }
        });
    }

    /*
     *  Return a list of `dk.data.Record`s that satisfy the `request`.
     *
     *  `request` can have the following fields::
     *
     *      start:    the index (0-based) of the first requested record
     *      end:      the index of the last requested record
     *      orphans:  if there are less than this many records after end, include them too
     *      sort:     a list of {field: <fieldname>, direction: "asc"|"desc"
     *      filter:   a json dict containing filter values.
     *
     *  get_records will call callback with the requested records in the following
     *  structure:
     *
     *      recordset   ::= {"fields": field-def, "records": record-data}
     *      field-def   ::= { (fieldname_1: {"name":__, "title":__, "type":__, ...)* }
     *      record-data ::= [ record* ]
     *      record      ::= { (field-name: field-value}* }
     *      field-name  ::= [-_a-zA-Z]+
     *      field-value ::= ...
     *
     *  or structurally:
     *
     *      recordset ::= {
     *          fields: {
     *              fieldname1: {
     *                  name: ___,
     *                  label: ___,
     *                  type: ___,
     *                  ...
     *              }, ...
     *          },
     *          meta: {
     *              start_recnum: __,
     *              totcount: __            // total number of records
     *          },
     *          records: [
     *              {field_name: field_value, ...},
     *              ...
     *          ]
     *      }
     */
    async fetch_records(request) {
        const p = request;
        p.end = (this.data.length - p.orphans < p.end) ? this.data.length : p.end;
        p.start = (p.start > p.end) ? p.end : p.start;

        this.do_sort(p);
        const search_recs = this.do_search(request);
        const result_recs = search_recs.slice(p.start, p.end);

        return new Promise((resolve, reject) => {
            resolve({
                fields: this.get_fields(),
                meta: {
                    totcount: this.data.length,
                    filter_count: search_recs.length,
                    start_recnum: p.start,
                    end_recnum: p.start + result_recs.length - 1
                },
                records: result_recs
            });
        });        
    }
    get_records(request, returns) {
        const p = request;
        p.end = (this.data.length - p.orphans < p.end) ? this.data.length : p.end;
        p.start = (p.start > p.end) ? p.end : p.start;

        this.do_sort(p);
        const search_recs = this.do_search(request);
        const result_recs = search_recs.slice(p.start, p.end);

        returns({
            fields: this.get_fields(),
            meta: {
                totcount: this.data.length,
                filter_count: search_recs.length,
                start_recnum: p.start,
                end_recnum: p.start + result_recs.length - 1
            },
            records: result_recs
        });
    }

    do_search(request) {
        if (!request.search) return this.data;
        return this.data.filter(function (rec) {
            for (let key in rec) if (rec.hasOwnProperty(key)) {
                if (typeof rec[key] === 'string' && rec[key].contains(request.search)) return true;
            }
            return false;
        });
    }

    do_sort(request) {
        if (request.sort && request.sort.length > 0 && request.sort[0].field) {
            this.data = sort_by(this.data, function (rec) {
                return rec[request.sort[0].field];
            });
            if (request.sort[0].direction === 'desc') {
                this.data.reverse();
            }
        }
    }

    /*
     *  Return a list of `dk.data.Field`s representing the "columns" of the
     *  data source (in the correct order).
     */
    get_fields() {
        if (this.data.length > 1) {
            const first = this.data[0];
            const field_defs = {};
            Object.keys(first).forEach(function (key, i) {
                field_defs[key] = {
                    name: key,
                    pos: i,
                    type: typeof first[key]
                };
            });
            return field_defs;
        }
        return {};
    }
}
