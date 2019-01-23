/*
 *  This file defines the boot-up sequence, ensuring that all fundamental components are
 *  loaded in the correct order.
 *
 *  To be included here, a module must be both free of internal dependencies (besides the ones
 *  that have been carefully ordered here), and generally useful (i.e. would have been imported
 *  in most modules), or cause unwanted import requirements if they were located elsewhere.
 *
 *  This file exports the `dk` namespace.
 *
 *  Note on JS scoping:
 *
 *  Function declarations/statements  (hoisted/global)
 *  --------------------------------------------------
 *
 *  They are hoisted and become properties of the global object.
 *
 *      fn();                           // No error
 *      function fn() {}
 *      console.log('fn' in window);    // true
 *
 *  Function expressions with ``var`` (hoisted/global)
 *  --------------------------------------------------
 *
 *  They are not hoisted, but a variable declared in the global scope always
 *  becomes a property of the global object.
 *
 *      fn();                           // TypeError
 *      var fn = function () {};
 *      console.log('fn' in window);    // true
 *
 *  Function expressions with ``let`` (!hoisted/!global/is module-global)
 *  ---------------------------------------------------------------------------
 *
 *  They are not hoisted, they do not become properties of the global object,
 *  but you can assign another value to your variable. Since JavaScript is
 *  loosely typed, your function could be replaced by a string, a number,
 *  or anything else.
 *
 *      fn();                           // ReferenceError
 *      let fn = () => {};
 *      console.log('fn' in window);    // false
 *      fn = 'Foo';                     // No error
 *
 *  Function expressions with ``const`` (!hoisted/!global/is module-global)
 *  -------------------------------
 *
 *  They are not hoisted, they do not become properties of the global object
 *  and you cannot change them through re-assignment. Indeed, a constant
 *  cannot be redeclared.
 *
 *      fn();                           // ReferenceError
 *      const fn = () => {};
 *      console.log('fn' in window);    // false
 *      fn = 'Foo';                     // TypeError
 *
 */
import "@babel/polyfill"; // must be first

import _dk from "./dk-obj";

import performance from "./performance-timer";


// import Lifecycle from "./lifecycle";
// performance('loaded-Lifecycle');

import sys from "./sys";
performance('loaded-sys');

import State from "./browser/dk-state";
performance('loaded-dk-state');

// import core from "./core";
// performance('core');

// // make sure we're not imported again..
// if (dkglobal && dkglobal.dk) {
//     let cver = dkglobal._dk.__version__ || 'unknown';
//     let myver = __version__ || 'unknown';
//     throw `Trying to import _dk.js (v${myver}), but _dk.js (v${cver}) is already imported.`;
// }

// // import "@webcomponents/webcomponentsjs";
// // import DkIcon from "./xtags/dk-icon";


_dk.performance('made-dk');
import cookie from "./browser/dk-cookie";
import format from "./data/datacore/dk-format";

// new Lifecycle(dk, {
//     externals: {
//         jQuery, _
//     },
//     ensure: {
//         css: [
//             {
//                 name: 'font-awesome',
//                 version: '470',
//                 sources: [
//                     "https://static.datakortet.no/font/fa470/css/font-awesome.css"
//                 ]
//             }
//         ]
//     }
// });

// Object.assign(dk, {
_dk.add({
    sys,
    // core,
    State,
    format,
    
    web: {
        cookie
    }, 
    
    ready(fn) {
        _dk.$(fn);
    }
});

// print out all startup performance metrics 
console.log("PERFORMANCE:", _dk.performance.toString());

// customElements.define('dk-icon', new _dk.DkIcon());

// //
// // export global jQuery/underscore..
// //
// if (!globals.$ && !scripttag_attributes['hide-jquery']) {
//     // Prevent export of jquery by adding a hide-jquery attribute to the script tag:
//     // <script hide-jquery src="/dkjs/dist/index.js"></script>
//     globals.$ = $;
//     globals.jQuery = $;
// }
//
// if (!globals._ && !scripttag_attributes['hide-underscore']) {
//     // <script hide-underscore src="/dkjs/dist/index.js"></script>
//     globals._ = _;
// }

import old_vs_new from "./dk-old-vs-new";
old_vs_new(_dk);

_dk.info('dk loaded');
_dk.ready(function () {
    _dk.info('dk-fully-loaded');
});
_dk.globals.dk = _dk;
export default _dk;    // must export default

