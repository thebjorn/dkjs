//
// var dk = require('../boot');
//
//
// var DataQuery = dk.Class.extend({
//     type: 'dk.data.Query',
//     pagenum: 0,     // for pager widgets etc.
//     start: 0,
//     end: 0,
//     orphans: 0,
//     search: "",
//     sort: [],
//     filter: {},
//
//     ctor: function (page_query, dataset) {
//         var q = page_query || {};
//         this.pagesize = q.pagesize || dataset.pagesize || dataset.datasource.default_pagesize || 25;
//         this.pagenum = q.pagenum || 0;
//         this.start = this.pagenum * this.pagesize;
//         this.end = this.start + this.pagesize;
//         this.orphans = q.orphans || dataset.orphans || 0;
//         this.search = q.search || this.search;
//         this.sort = q.sort || this.sort;
//         this.filter = q.filter || this.filter;
//     },
//
//     copy: function () {
//         return {
//             pagesize: this.pagesize,
//             pagenum: this.pagenum,
//             start: this.start,
//             end: this.end,
//             orphans: this.orphans,
//             search: this.search,
//             sort: this.sort,
//             filter: this.filter
//         };
//     },
//
//     // must define toString so this class can be used as keys in a dict.
//     toString: function () {
//         var self = this;
//         return JSON.stringify({
//             start: self.start,
//             end: self.end,
//             orphans: self.orphans,
//             sort: self.sort,
//             search: self.search,
//             filter: self.filter
//         });
//     },
//
//     _axdata: function () {
//         var sortcol = function (sitem) {
//             if (sitem.field === undefined) return '';
//             return (sitem.direction === 'desc' ? '-' : '') + sitem.field;
//         };
//         var data = {
//             s: this.sort.map(sortcol).join(','),
//             start: this.start,
//             q: this.search,
//             end: this.end,
//             ft: this.filter
//         };
//         if (data.s === "") delete data.s;
//         if (data.start === 0) delete data.start;
//         if (data.q === "") delete data.q;
//         if (_.isEqual(data.ft, {})) delete data.ft;
//         return data;
//     },
//
//     toGetParams: function() {
//         return 'state=' + encodeURIComponent(JSON.stringify(this._axdata()));
//     }
// });
//
// module.exports = DataQuery;
