
import _ from 'lodash';
import jQuery from 'jquery';

import __version__ from './version';
import Class from './boot/dk-class';
import namespace from './boot/dk-namespace';

var dk = function dk(selector) {
    return document.querySelector(selector);
};

Object.assign(dk, {
    // external hooks
    $: jQuery,
    _: _,

    __version__: __version__,
    Class: Class,
    namespace: namespace,

    all(selector) {
        return  document.querySelectorAll(selector);
    },

    ready(fn) {
        jQuery(fn);
    }
});

// module.exports = dk;
export default dk;

//
// const getGlobal = function () {
//     // the only reliable means to get the global object is
//     // `Function('return this')()`
//     // However, this causes CSP violations in Chrome apps.
//     if (typeof self !== 'undefined') { return self; }
//     if (typeof window !== 'undefined') { return window; }
//     if (typeof global !== 'undefined') { return global; }
//     throw new Error('unable to locate global object');
// };
// const dkglobal = getGlobal();  // var is intended here!
//
// dkglobal.dk = function (selector) { return document.querySelector(selector); };
//
//
//
// export default namespace.update(dkglobal.dk, {

// });
