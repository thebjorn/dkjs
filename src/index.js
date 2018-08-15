
import _ from 'lodash';
import jQuery from 'jquery';

import Class from './boot/dk-class';
import namespace from './boot/dk-namespace';


const getGlobal = function () {
    // the only reliable means to get the global object is
    // `Function('return this')()`
    // However, this causes CSP violations in Chrome apps.
    if (typeof self !== 'undefined') { return self; }
    if (typeof window !== 'undefined') { return window; }
    if (typeof global !== 'undefined') { return global; }
    throw new Error('unable to locate global object');
};
const dkglobal = getGlobal();  // var is intended here!

dkglobal.dk = function (selector) { return document.querySelector(selector); }



export default namespace.update(dk, {
    $: jQuery,
    _: _,
    Class: Class,
    namespace: namespace,
    
    all: selector => document.querySelectorAll(selector),
    ready(fn) {
        $(fn);
    }
});

// export default dk;
