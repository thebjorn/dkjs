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
// import "@babel/polyfill"; // must be first

import dk from "./dk-obj";
// import performance from "./performance-timer";


// import Lifecycle from "./lifecycle";
// performance('loaded-Lifecycle');

import sys from "./sys";
// performance('loaded-sys');

import state from "./browser/dk-state";
// performance('loaded-dk-state');

// import core from "./core";
// performance('core');

// // make sure we're not imported again..
// if (dkglobal && dkglobal.dk) {
//     let cver = dkglobal.dk.__version__ || 'unknown';
//     let myver = __version__ || 'unknown';
//     throw `Trying to import dk.js (v${myver}), but dk.js (v${cver}) is already imported.`;
// }

// // import "@webcomponents/webcomponentsjs";
// // import DkIcon from "./xtags/dk-icon";


// dk.performance('made-dk');
import cookie from "./browser/dk-cookie";
import format from "./data/datacore/dk-format";
import jason from "./data/datacore/dk-json";
import {parse_uri} from "./lifecycle/uri";
import {DateTime, DkDate, Duration} from "./data/datacore/dk-datatypes";
import dom from "./browser/dom";
import {Template, DomItem} from "./browser/dk-dom-template";
import utidy from "./browser/dk-html";
import css from "./browser/dk-css";
import old_vs_new from "./dk-old-vs-new";
import {jq_links2popup} from "./browser/jquery-plugins";
import page from "./widgetcore/dk-page";
import widgetmap from "./widgetcore/dk-widgetmap";
import {Layout} from "./layout/dk-layout";
import {Widget} from "./widgetcore/dk-widget";

(function () {
    dk.add({
        sys,
        // core,
        State: state.State,
        format,
        format_value: format.value,
        Date: DkDate,
        DateTime,
        Duration,
        jason,
        parse_uri,
        ...dom,
        Template,
        DomItem,
        node: dom.create_dom,
        // here: dom.here,
        utidy,
        css,
        
        layout: {
            Layout
        },

        widget: {
            page,
            widgetmap,
            Widget
        },
        
        update(...args) {
            return Object.assign(...args);
        },
        data: {
            datatype: {
                Date: DkDate,
                DateTime,
                Duration
            },
            format: {format},
            jason
        },

        web: {
            cookie,
            uri: {parse: parse_uri},
            dom: {
                ...dom,
                Template: Template,
                DomItem: DomItem
            },
            html: {
                tidy: utidy
            },
            css,
            state
        },
        dom: {
            ...dom,
            DomItem,
            Template
        },

        ready(fn) {
            dk.$(fn);
        }
    });

    // print out all startup performance metrics 
    // eslint-disable-next-line no-console
    console.log("PERFORMANCE:", dk.performance.toString());
    
    // customElements.define('dk-icon', new dk.DkIcon());
    
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

    old_vs_new(dk);

    dk.info('dk loaded');
    dk.ready(function () {
        jq_links2popup(dk);
        dk.info('dk-fully-loaded');
    });
})();

// because webpack makes simple things difficult..
// dk.globals.dk = dk;
// export dk;    // must export default

export {dk};
