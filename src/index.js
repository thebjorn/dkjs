
import Lifecycle from "./lifecycle";

// import dkglobal from './dkglobal';
// import __version__ from './version';
//
// // make sure we're not imported again..
// if (dkglobal && dkglobal.dk) {
//     let cver = dkglobal.dk.__version__ || 'unknown';
//     let myver = __version__ || 'unknown';
//     throw `Trying to import dk.js (v${myver}), but dk.js (v${cver}) is already imported.`;
// }
//
// import _ from 'lodash';
// // const _lodash_version = _.VERSION;     // e.g. "4.16.6"
//
// import jQuery from 'jquery';
// const _jq_version = jQuery.fn.jquery;  // e.g. "3.1.0"
//
// // import "@webcomponents/webcomponentsjs";
// // import DkIcon from "./xtags/dk-icon";
//
//
// import Class from './lifecycle/boot/dk-class';
// import namespace from './lifecycle/boot/dk-namespace';

var dk = function dk(selector) {
    return document.querySelector(selector);
};

new Lifecycle(dk, {
    ensure: {
        css: [
            {
                name: 'font-awesome',
                version: '470',
                sources: [
                    "https://static.datakortet.no/font/fa470/css/font-awesome.css"
                ]
            }
        ]
    }
});

Object.assign(dk, {
    // external hooks
    $: jQuery,
//     _: _,
//
//     __version__: __version__,
//     Class: Class,
//     namespace: namespace,
//
//     // DkIcon: DkIcon,
//
//     all(selector) {
//         return  document.querySelectorAll(selector);
//     },
//
    
    // lifecycle: lifecycle,
    
    ready(fn) {
        jQuery(fn);
    }
});

// customElements.define('dk-icon', new dk.DkIcon());


module.exports = dk;    // must use commonjs syntax here
