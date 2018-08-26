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

// from es6-shim
const getGlobal = function () {
    // the only reliable means to get the global object is
    // `Function('return this')()`
    // However, this causes CSP violations in Chrome apps.
    if (typeof self !== 'undefined') { return self; }
    if (typeof window !== 'undefined') { return window; }
    if (typeof global !== 'undefined') { return global; }
    throw new Error('unable to locate global object');
};
var globals = getGlobal();  // var is intended here!

// // structural
// //require('../../external/x-tag-core.js');
// const xtag = require('x-tag');
//
// // global
// const $ = require('jquery');
// const _ = require('lodash');
//
// // polyfills
// // require('es5-shim');
// // require('es6-shim');
//
// require('../../external/base64.js');
// require('./dk-shims.js');
//
// const env = require('./dk-dkjsinclude.js');
// const console = require('./dk-console.js');
// const namespace = require('./dk-namespace.js');
// const publish = require('./dk-publish.js');

global.dk = function (x) { return document.querySelector(x); };
global.dk.all = function (x) { return document.querySelectorAll(x); };

module.exports = namespace.update(dk, {
    // $: $,
    // _: _,
    // env: env,
    // version: require('../version.js'),
    // globals: globals,
    //
    // debug: console.debug,
    // warn: console.warn,
    // info: console.info,
    // error: console.error,
    // dir: console.dir,
    // log: console.log,
    //
    // namespace: namespace.create_namespace,
    // traverse: namespace.traverse,
    // update: namespace.update,
    // merge: namespace.merge,
    // combine: namespace.combine,
    //
    // subscribe: publish.subscribe,
    // on: publish.on,
    // publish: publish.publish,
    // after: publish.after,
    //
    // import: require('./dk-require.js'),
    Class: require('./dk-class.js')
});
    


    //
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
