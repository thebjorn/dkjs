// /*
//  * A DataPage is a concrete list of records to be 'displayed'.
//  *
//  * A DataPage is the single source of truth for these records.
//  *
//  */
//
// var dk = require('../boot');
// var _ = require('lodash');
//
//
// var DataPage = dk.Class.extend({
//     type: 'dk.data.page',
//     query: null,
//     /*
//      *      recordset ::= {
//      *          fields: {
//      *              fieldname1: {
//      *                  name: ___,
//      *                  title: ___,
//      *                  type: ___,
//      *                  ...
//      *              }, ...
//      *          },
//      *          records: [
//      *              {pk:__, field_name: field_value, ...},
//      *              ...
//      *          ]
//      *      }
//      */
//     recordset: {},
//
//     /*
//      *  dirtyset ::= {
//      *      pk: {field_name: new_value, ...},
//      *      ...
//      *  }
//      */
//     dirtyset: {},
//
//     init: function () {
//         var self = this;
//         var fields =  [];
//         this.get_field_names().map(function (fname) {
//             var field = self.get_field(fname);
//             field.name = fname;
//             fields.push(field);
//         });
//         this.fields = fields;
//
//         // convenience
//         this.records = this.recordset.records;
//
//         self.record = {};    // pk -> record
//         this.records.forEach(function (r) {
//             self.record[r.pk] = r;
//         });
//     },
//     // --------------------------------------------------
//
//     add_dirty: function (pk, field, newval, oldval, widget) {
//         var dirtyrec = this.dirtyset[pk] || {};
//         //if (dirtyrec && dirtyrec.newval != oldval) dk.error("Data synchronization error:", pk, field, newval, oldval, this);
//         dirtyrec[field.name] = {
//             oldval: oldval,
//             newval: newval
//         };
//         this.dirtyset[pk] = dirtyrec; // {[field.name]: {oldval:a, newval: b}}
//     },
//
//     update: function (datasource, fn) {
//         if (!this.dirtyset) return;
//         datasource.update(this.dirtyset, fn);
//         this.dirtyset = {};
//     },
//
//     // --------------------------------------------------
//     get_record: function (pk) {
//         return this.record[pk];
//     },
//
//     get_record_keys: function () {
//         return this.recordset.records.map(function (record) {
//             return record.pk;
//         });
//     },
//     // --------------------------------------------------
//     get_field: function (fname) {
//         return this.recordset.fields[fname];
//     },
//
//     get_field_names: function () {
//         return Object.keys(this.recordset.fields);
//     },
//
//     get_field_list: function () {
//         var self = this;
//         return this.get_field_names().map(function (fname) {
//             return self.get_field(fname);
//         });
//     }
//
// });
//
// module.exports = DataPage;
