//
// var _ = require('lodash');
// var dk = require('../../boot');
// var xhr = require('../../web/dk-client');
// var JSONDataSource = require('./dk-json-datasource.js');
// var json = require('../datacore/dk-json.js');
// var datacore = require('../../data/datacore');
//
//
// var AjaxDataSource = JSONDataSource.extend({
//     url: '',
//     _fields: null,
//     default_pagesize: 5,
//
//     _axdata: function (request) {
//         var sortcol = function (sitem) {
//             if (sitem.field === undefined) return '';
//             return (sitem.direction === 'desc' ? '-' : '') + sitem.field;
//         };
//         var data = {
//             s: request.sort.map(sortcol).join(','),
//             start: request.start,
//             q: request.search,
//             end: request.end,
//             ft: request.filter
//         };
//         if (data.s === "") delete data.s;
//         if (data.start === 0) delete data.start;
//         if (data.q === "") delete data.q;
//         if (_.isEqual(data.ft, {})) delete data.ft;
//         return data;
//     },
//
//     _ajax: function (cmd, data) {
//         // for data to be sent as json, the type must be POST, dataType 'json', contentType
//         // set as below, and data must be json (ie. a string).
//         var self = this;
//         var defaults = {
//             cache: false,
//             type: 'POST',
//             dataType: 'json',
//             url: self.url + '!' + cmd,
//             contentType: "application/json; charset=utf-8",
//             statusCode: {
//                 404: function () { dk.debug("Page not found: " + self.url); },
//                 500: function () { window.open(self.url); }
//             },
//             error: function (req, status, err) {
//                 self.waiting = false;
//                 dk.warn("ERROR", req, status, err);
//                 //dk.notify(self, 'fetch-data-error', req, status, err);
//                 throw {error: "fetch-error", message: status + ' ' + err};
//             },
//             converters: {
//                 "text json": datacore.jason.parse
//             },
//             success: function (data) {
//                 // dk.debug("dk-ajax-datasource-DATA:", data);
//                 if (data.error) {
//                     dk.warn(data);
//                     throw data;
//                 } else {
//                     //self.data = json.postparse(data);
//                     self.data = data;
//                     self.waiting = false;
//                     this.do_success(self.data);
//                 }
//             }
//         };
//         dk.update(defaults, data);
//         defaults.data = JSON.stringify(defaults.data);
//         xhr.ajax(defaults);
//     },
//
//     update: function (changes, fn) {
//         // var keymap = this._keymap();
//         // var fieldmap = this._field_order();
//         var self = this;
//
//         this._ajax('update', {
//             data: {
//                 data: this.data,
//                 changes: changes
//             },
//             do_success: function (data) {
//                 fn(self._get_records(self.last_request, data), self.last_request);
//             }
//             // do_success: function (changes) {
//             //     console.log("update-data", data);
//             //     Object.keys(changes).forEach(function (pk) {
//             //     var change = changes[pk];
//             //     var datarec = keymap[pk];
//             //     Object.keys(change).forEach(function (fieldname) {
//             //         datarec.c[fieldmap[fieldname]] = change.newval;
//             //     });
//             // });
//             // }
//         });
//     },
//
//     get_filter_data: function (name, callback) {
//         this._ajax('get-filter-values', {
//             data: {name: name},
//             do_success: function (data) {
//                 callback(data);
//             }
//         });
//     },
//
//     get_records: function (request, returns) {
//         var self = this;
//         //var p = this.get_defaults(request);
//         this.last_request = request;
//         var axdata = self._axdata(request);
//
//         this._ajax('get-records', {
//             data: axdata,
//             do_success: function (data) {
//                 returns(self._get_records(request, data));
//             }
//         });
//     }
// });
//
//
// module.exports = AjaxDataSource;
