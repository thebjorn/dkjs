/*
 * A DataPage is a concrete list of records to be 'displayed'.
 *
 * A DataPage is the single source of truth for these records.
 *
 */

// const dk = require('../boot');
// const _ = require('lodash');


import Class from "../lifecycle/coldboot/dk-class";


export class DataPage extends Class {
    constructor(props) {
        super(Object.assign({
            // type: 'dk.data.page',
            query: null,
            /*
             *      recordset ::= {
             *          fields: {
             *              fieldname1: {
             *                  name: ___,
             *                  title: ___,
             *                  type: ___,
             *                  ...
             *              }, ...
             *          },
             *          records: [
             *              {pk:__, field_name: field_value, ...},
             *              ...
             *          ]
             *      }
             */
            recordset: {},

            /*
             *  dirtyset ::= {
             *      pk: {field_name: new_value, ...},
             *      ...
             *  }
             */
            dirtyset: {},            
        }, props));

        const fields =  [];
        this.get_field_names().map(fname => {
            const field = this.get_field(fname);
            field.name = fname;
            fields.push(field);
        });
        this.fields = fields;

        // convenience
        this.records = this.recordset.records;

        this.record = {};    // pk -> record
        this.records.forEach(r => {
            this.record[r.pk] = r;
        });
    }
    // --------------------------------------------------

    add_dirty(pk, field, newval, oldval, widget) {
        const dirtyrec = this.dirtyset[pk] || {};
        //if (dirtyrec && dirtyrec.newval != oldval) dk.error("Data synchronization error:", pk, field, newval, oldval, this);
        dirtyrec[field.name] = {
            oldval: oldval,
            newval: newval
        };
        this.dirtyset[pk] = dirtyrec; // {[field.name]: {oldval:a, newval: b}}
    }

    update(datasource, fn) {
        if (!this.dirtyset) return;
        datasource.update(this.dirtyset, fn);
        this.dirtyset = {};
    }

    // --------------------------------------------------
    get_record(pk) {
        return this.record[pk];
    }

    get_record_keys() {
        return this.recordset.records.map(function (record) {
            return record.pk;
        });
    }
    // --------------------------------------------------
    get_field(fname) {
        return this.recordset.fields[fname];
    }

    get_field_names() {
        return Object.keys(this.recordset.fields);
    }

    get_field_list() {
        const self = this;
        return this.get_field_names().map(function (fname) {
            return self.get_field(fname);
        });
    }

}
