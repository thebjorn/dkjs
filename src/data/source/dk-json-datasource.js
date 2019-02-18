//
// var _ = require('lodash');
// var Source = require('./dk-datasource-base.js');
//
//
// var JSONDataSource = Source.extend({
//     data: {},
//
//     init: function () {
//         this._column_number = {};
//     },
//    _keymap: function () {
//        // returns a mapping from primary key to row
//        var res = {};
//        this.data.rows.forEach(function (row) {
//            res[row.k] = row;
//        });
//        return res;
//    },
//
//    _field_order: function () {
//        var res = {};
//        this.data.cols.forEach(function (col, i) {
//            res[col.name] = i;
//        });
//        return res;
//    },
//
//     update: function (changes) {
//         var keymap = this._keymap();
//         var fieldmap = this._field_order();
//
//         Object.keys(changes).forEach(function (pk) {
//             var change = changes[pk];
//             if (change.oldval === change.newval) return;
//            
//             var datarec = keymap[pk];
//             Object.keys(change).forEach(function (fieldname) {
//                 datarec.c[fieldmap[fieldname]] = change.newval;
//             });
//         });
//     },
//
//     do_sort: function (request) {
//         var self = this;
//
//         if (request.sort.length && request.sort[0].field) {
//             if (request.sort[0].field) {
//                 this.data.rows = _.sortBy(this.data.rows, function (rec) {
//                     var colval = rec.c[self._column_number[request.sort[0].field]];
//                     return colval.v || colval.f || colval;
//                 });
//                 if (request.sort[0].direction === 'desc') {
//                     this.data.rows.reverse();
//                 }
//             }
//         }
//     },
//
//     rows_to_records: function (request, rows, fields) {
//         return rows.map(function (row, i) {
//             var record = {
//                 pk: row.k,
//                 rownum: request.start + i
//             };
//             Object.keys(fields).forEach(function (fname, i) {
//                 record[fname] = row.c[i];
//             });
//             return record;
//         });
//     },
//
//     /*
//      *  Convert json data into a recordset for use with the widgets.
//      *
//      *  The meta property has the following components:
//      *
//      *    totcount:         the total number of records in the domain
//      *    filter_count:     the number of records left after applying filters.
//      *                      If filter_count == totcount then no filters have
//      *                      been applied.
//      *    start_recnum:     the first index of the returned records
//      *    end_recnum:       the last index of the returned records
//      *
//      */
//     _get_records: function (request, data) {
//         var fields = this.get_fields(data);
//         return {
//             fields: fields,
//             meta: data.info,
//             records: this.rows_to_records(request, data.rows, fields)
//         };
//     },
//    
//     get_records: function (request, returns) {
//         var p = this.get_defaults(request);
//         this.data.info = {
//             start_recnum: p.start,
//             totcount: this.data.rows.length
//         };
//         this.do_sort(p);
//         // filter data here..
//         this.data.info.filter_count = this.data.rows.length;
//         // slice data here..
//         this.data.rows = this.data.rows.slice(p.start, p.end);
//         returns(this._get_records(request, this.data));
//     },
//
//     get_fields: function (data) {
//         // returned as part of _get_records(..)
//         var self = this;
//         var field_defs = {};
//         if (!data || !data.cols) return [];
//         data.cols.forEach(function (col, i) {
//             self._column_number[col.name] = i;
//             field_defs[col.name] = {
//                 name: col.name,
//                 pos: i,
//                 type: col.datatype,
//                 sortable: col.sortable,
//                 label: col.label,
//                 help_text: col.help_text,
//                 widget: col.widget,
//                 data: col.data
//             };
//         });
//         return field_defs;
//     }
// });
//
//
// module.exports = JSONDataSource;
