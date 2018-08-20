
import dkglobal from './dkglobal';
import __version__ from './version';

// make sure we're not imported again..
if (dkglobal && dkglobal.dk) {
    let cver = dkglobal.dk.__version__ || 'unknown';
    let myver = __version__ || 'unknown';
    throw `Trying to import dk.js (v${myver}), but dk.js (v${cver}) is already imported.`;
}

import _ from 'lodash';
// const _lodash_version = _.VERSION;     // e.g. "4.16.6"

import jQuery from 'jquery';
const _jq_version = jQuery.fn.jquery;  // e.g. "3.1.0"

// import "@webcomponents/webcomponentsjs";
// import DkIcon from "./xtags/dk-icon";


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
    
    // DkIcon: DkIcon,

    all(selector) {
        return  document.querySelectorAll(selector);
    },

    ready(fn) {
        jQuery(fn);
    }
});

// customElements.define('dk-icon', new dk.DkIcon());

// (function __init__dk() {
//     dk.lodash_version = _.VERSION;
// })();

module.exports = dk;    // must use commonjs syntax here
// export default dk;   // es6 syntax
