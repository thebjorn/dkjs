

/*
 *  Abstract base class (interface) of the data source classes.
 */
import counter from "../../core/counter";
import Class from "../../lifecycle/coldboot/dk-class";


export class DataSource extends Class {
    constructor() {
        super();
        this.data = [];
        this.total_items = undefined;
        this.selected_items = undefined;
        this.id = this.name = counter('datasource_');
    }

    /*
     *  Fill out request with defaults for missing values.
     */
    get_defaults(request) {
        return {
            start: request.start || 0,
            end: request.end || 25,
            orphans: request.orphans || 0,
            sort: request.sort || [],
            filter: request.filter || {}
        };
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
     *      field-def   ::= { (fieldname_1: {"name":__, "pos":__, "title":__, "type":__, ...)* }
     *      record-data ::= { (pk_1: record_1)* }
     *      record-data ::= [ record* ]
     *      field-name  ::= [-_a-zA-Z]+
     *      field-value ::= ...
     */
    async fetch_records(request) {
        return new Promise((resolve, reject) => {
            resolve({
                fields: {},
                meta: {},
                records: {}
            });
        });
    }
    get_records(request, returns) {
        returns({
            fields: {},
            meta: {},
            records: {}
        });
    }

    get_filter_data(filter_name, returns) {
        returns({
            missing: 'data missing',
            need_to: 'need to implement get_filter_data in datasource'
        });
    }

    /*
     *  Return a list of `dk.data.Field`s representing the "columns" of the
     *  data source (in the correct order).
     */
    get_fields() { return []; }

    /*
     *  Update the data source with `changes`.
     *
     *  `changes` is a list where items have the following fields::
     *
     *      {pk: <primary-key>, (field-name: new-value)+}
     *
     *   the data source should unconditionally save changes to all the specified
     *   fields, but only to the records/fields that have changes.
     */
    update(changes) {}

    /*
     *  (not implemented yet)
     *  The data-grid, via `dk.data.Data`, calls this method to warn the data
     *  source that it is about to start editing the data with primary key(s?)
     *  `pk` (so e.g. a select for update or similar can be performed).
     */
    start_editing(pk) {}
    stop_editing(pk) {}
}
