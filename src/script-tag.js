
/*
 *  This file is loaded very early, and thus cannot use any other dk modules.
 *  dk initialization tasks should be performed in lifecycle.initialize().
 *  (notably, it can not use dkconsole...!)
 */
var $ = require('jquery');


// don't need to wait for document ready since we're only accessing header
// tags..
var node = $('head>script[src$="dk.js"]');
if (node.length === 0) node = $('head>script[src$="dk.min.js"]');
if (node.length === 0) node = $('head>script[src*="dk.min"]');
if (node.length === 0) node = $('head>script[src*="dk.max"]');

// console.info("NODE:", node);

var res = {
    tag: node,
    debug: false,
    loglevel: 0
};

$.each(node.get(0).attributes, function (v, n) {
    n = n.nodeName || n.name;
    v = node.attr(n);
    if (v !== undefined && v !== false) {
        if (v === "") v = true;
        res[n] = v;
    }
});


var _loglevel = node.attr('LOGLEVEL');
_loglevel = _loglevel === undefined? 0: parseInt(_loglevel, 10);
res.loglevel = _loglevel;

var _main = node.attr('data-main');
if (_main) {
    // endsWith is ES6, and we're probably too early in the bootstrapping
    // process to use any serious polyfills..
    //if (!_main.endsWith('.js')) _main += '.js';
    if (_main.slice(-_main.length) !== '.js') _main += '.js';
}
res.main = _main;

module.exports = res;
