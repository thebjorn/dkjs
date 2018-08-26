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

import Lifecycle from "./lifecycle";

import __version__ from './version';

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
Object.assign(dk, {
    __version__,
    
    all(selector) {
        return document.querySelectorAll(selector);
    }
});

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
//     // DkIcon: DkIcon,
    
    ready(fn) {
        jQuery(fn);
    }
});

// customElements.define('dk-icon', new dk.DkIcon());

// //
// // export global jQuery/underscore..
// //
// if (!globals.$ && !env['hide-jquery']) {
//     // Prevent export of jquery by adding a hide-jquery attribute to the script tag:
//     // <script hide-jquery src="/dkjs/dist/index.js"></script>
//     globals.$ = $;
//     globals.jQuery = $;
// }
//
// if (!globals._ && !env['hide-underscore']) {
//     // <script hide-underscore src="/dkjs/dist/index.js"></script>
//     globals._ = _;
// }

module.exports = dk;    // must use commonjs syntax here
