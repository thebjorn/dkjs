//
// var dk = require('../boot');
// var _ = require('lodash');
// var AjaxDataSource = require('../data/source/dk-ajax-datasource.js');
// var ArrayDataSource = require('../data/source/dk-array-datasource.js');
// var counter = require('../core/dk-counter.js');
// var DataPage = require('./dk-datapage.js');
// var DataQuery = require('./dk-dataquery.js');
//
// /*
//  *  A DataSet is an abstract paged collection of data items.
//  *
//  *  A DataSet can provide a conrete DataPage (i.e. a list of
//  *  records to be displayed).
//  *
//  *  The purpose of a DataSet is to provide such
//  *  a DataPage by querying the underlying data source.
//  *
//  *  DataSet -> DataPage -> (data) Record -> (data) Field) -> (data) FieldValue
//  */
// var DataSet = dk.Class.extend({
//     type: 'dk.data.Data',
//     datasource: null,
//     pages: null,            // dict[query -> page]
//     page: null,             // current page
//
//     pagenum: 0,             // current page number
//     totpages: 0,            // total number of pages
//
//     pagesize: 25,
//     orphans: 0,
//
//     init: function () {
//         this.pages = {};
//         this._filter_data = {};
//     },
//
//     // synchronize dirty elements on page to datasource.
//     update: function () {
//         var self = this;
//         this.pages = {};  // clear cache
//         this.page.update(this.datasource, this.FN('_new_recordset'));
//         // this.page.update(this.datasource, function (recordset) {
//         //     self._new_recordset(self._get_records(null, recordset));
//         // });
//     },
//
//     _new_recordset: function (recordset, query) {
//         var page = DataPage.create({
//             query: query,
//             recordset: recordset
//         });
//         if (recordset.meta) {
//             var m = recordset.meta;
//             //dk.dir('query', query);
//             if (m.totcount === undefined && m.filter_count === undefined) {
//                 m.totcount = 0;
//                 m.filter_count = 0;
//             }
//             if (m.totcount && m.filter_count === undefined) m.filter_count = m.totcount;
//             if (m.pagecount === undefined && m.filter_count === 0) {
//                 m.pagecount = 0;
//             } else if (m.filter_count !== undefined && !m.pagecount) {
//                 m.pagecount = Math.max(1, Math.floor(m.filter_count / query.pagesize));
//                 if (m.filter_count > query.pagesize && m.filter_count % query.pagesize > query.orphans) {
//                     ++m.pagecount;
//                 }
//             }
//         }
//         dk.on(page, 'dirty').run(this.FN('update'));
//         this.page = this.pages[query] = page;
//         dk.publish(this, 'fetch-info', page.recordset.meta, query);
//         dk.publish(this, 'fetch-data', this, page);
//     },
//
//     get_page: function (query) {
//         var self = this;
//         query = DataQuery.create(query, this);
//         // dk.dir("GET-PAGE:", query.copy());
//         dk.publish(this, 'fetch-data-start');
//
//         if (!this.pages[query]) {
//             // this.datasource.get_records(query, this.FN('_new_recordset'));
//             this.datasource.get_records(query, function (recordset) {
//                 self._new_recordset(recordset, query);
//             });
//         } else {
//             dk.info("GET-PAGE... cached!");
//             this.page = this.pages[query];
//             dk.publish(this, 'fetch-info', this.page.recordset.meta, query);
//             dk.publish(this, 'fetch-data', this, this.page);
//         }
//     },
//
//     _current_query: function () {
//         if (this.page) return this.page.query.copy();
//         return {};
//     },
//
//     /*
//      *  Fetch page number `n` (zero-based).
//      */
//     get_pagenum: function (n) {
//         var query = this._current_query();
//         query.pagenum = n;
//         this.get_page(query);
//     },
//
//     set_search: function (terms) {
//         var query = this._current_query();
//         query.search = terms;
//         query.pagenum = 0;
//         this.get_page(query);
//     },
//
//     set_sort: function (fieldname, direction) {
//         var query = this._current_query();
//         var newsort = {field: fieldname, direction: direction};
//         query.sort = [newsort];
//         query.pagenum = 0;
//         this.get_page(query);
//     },
//
//     get_filter_data: function (filter_name, returns) {
//         // get data needed to display filter with name `filter_name`
//         if (this._filter_data[filter_name]) {
//             returns(this._filter_data[filter_name]);
//         } else {
//             this.datasource.get_filter_data(filter_name, returns);
//         }
//     },
//
//     set_filter: function (vals) {
//         var query = this._current_query();
//         query.filter = vals;
//         query.pagenum = 0;
//         this.get_page(query);
//     },
//
//     fetch_csv: function (filename) {
//         var query = this._current_query();
//         query.pagesize = 50000;
//         query = DataQuery.create(query, this);
//         if ($('#downloadFile').length) {
//             $('#downloadFile').remove();
//         }
//         var url = this.datasource.url+"!get-records?fmt=csv&filename="+ filename + '&' + query.toGetParams();
//         $('<a></a>')
//             .attr('id','downloadFile')
//             .attr('href',url)
//             .attr('target', '_blank')
//             .appendTo('body');
//         $('#downloadFile').ready(function() {
//             $('#downloadFile').get(0).click();
//         });
//     }
// });
//
//
// module.exports = DataSet;
