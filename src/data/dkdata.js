//
// var datacore = require('./datacore');
// var datasource = require('./source');
//
//
// module.exports = {
//     format: datacore.format,
//     datatype: datacore.datatype,
//     jason: datacore.jason,
//
//     DataSet: require('./dk-dataset.js'),
//     DataPage: require('./dk-datapage.js'),
//     //Record: require('./dk-data-record.js'),
//     //Field: require('./dk-data-field.js'),
//     //FieldValue: require('./dk-data-fieldvalue.js'),
//
//     Source: datasource.Source,
//     ArraySource: datasource.ArraySource,
//     JSONDataSource: datasource.JSONDataSource,
//     AjaxDataSource: datasource.AjaxDataSource,
//
//     grid2records: function (g) {
//         if (!g) return [];
//         var rows = g.rows;
//         var cols = g.cols;
//         return rows.map(function (row, i) {
//             var rec = {
//                 pk: row.k,
//                 rownum: i
//             };
//             cols.forEach(function (col, j) {
//                 rec[col.name] = row.c[j];
//             });
//             return rec;
//         });
//     }
// };
