
/**
 *   Startup semantics:
 *
 *     1.
 */
import _ from 'lodash';
import {parse_src} from "./uri";
import dkglobal from './dkglobal';
import setup_console from './browser/dk-console';
import Class from './boot/dk-class';
import namespace from './boot/dk-namespace';
import setup_signals from "./boot/dk-signals";
import discover_initial_environment from "./lifecycle-discover-initial-environment";

const array_intersection = (a, b) => {
    const bs = new Set(b);
    return new Set(a.filter(x => bs.has(x)));
};
const set_empty = s => s.size === 0;


class Lifecycle {
    constructor(dk, attrs) {
        dk.stats.lifecycle0 = performance.now();
        
        discover_initial_environment(dk, attrs);
        
        // save global vars (or undefined)
        let DEBUG = dkglobal.DEBUG;
        let LOGLEVEL = dkglobal.LOGLEVEL;
        
        this.scripttag_attributes = {
            DEBUG: false,
            LOGLEVEL: null,
            crossorigin: null,
            // globals: dkglobal
        };

        this.parse_script_tag(dk, attrs);
        
        // global vars override script tag vars
        if (typeof DEBUG !== 'undefined') this.scripttag_attributes.DEBUG = DEBUG;
        if (typeof LOGLEVEL !== 'undefined') this.scripttag_attributes.LOGLEVEL = LOGLEVEL;
        

        
        Object.assign(dk, this.scripttag_attributes);            // add dkjs tag attributes
        
        
        this.prepare_dk_object(dk, attrs);


        setup_console(dk);                      // add console
        Object.assign(dk, {Class, namespace});  // add Class and namespace
        setup_signals(dk, dk.debug ? dk.ERROR : dk.INFO);
        
        dk.lifecycle = this;
    }
    


    parse_script_tag(dk, attrs) {
        let tag = dk.webpage.scripts.dk.tag;
        
        _.each(tag.attributes, attr => {  // node.attributes cannot for-of on IE
            switch (attr.name) {
                case 'DEBUG':
                    // <script debug src=..> => debug===4
                    this.scripttag_attributes.DEBUG = true;
                    break;
                case 'LOGLEVEL':
                    // <script debug src=..> => debug===4
                    this.scripttag_attributes.loglevel = parseInt(attr.value || "4", 10);
                    break;
                case 'crossorigin':
                    this.scripttag_attributes.crossorigin = attr.value;
                    break;
                case 'data-main':
                    let val = attr.value;
                    if (val.slice(-val.length) !== '.js') {
                        val += '.js';
                    }
                    this.scripttag_attributes[attr.name] = val;
                    break;
                default:
                    this.scripttag_attributes[attr.name] = attr.value;
                    break;
            }
        });
        if (this.scripttag_attributes.LOGLEVEL === null) {
            this.scripttag_attributes.LOGLEVEL = this.scripttag_attributes.DEBUG ? 4 : 0;
        }
    }
    
    prepare_dk_object(dk, attrs) {
        if (dk.DEBUG || true) {
            dk.add = function (attrs) {
                let common = array_intersection(Object.keys(dk), Object.keys(attrs));
                if (!set_empty(common)) {
                    throw `ERROR: trying to add existing property: ${[...common]}`;
                }
                Object.assign(dk, attrs);
            };
        } else {
            dk.add = attrs => Object.assign(dk, attrs);
        }
    }
    


    
    // verify_resources() {}
    // load_externals() {}
    // load_core() {}
    // initialize_page() {}
    // dk_ready() {}
    // dk_unload() {}
    
}

export default Lifecycle;

// const lifecycle = new Lifecycle();
// export default lifecycle;

//
// var dk = require('../boot');
//
// var _dktag = require('../boot/dk-dkjsinclude.js');
// var _dkrequire = require('../boot/dk-require.js');
//
//
// var __document_ready__ = false;
// var _ready_queue = [];
// var _bind_q = [];
//
//
// module.exports = {
//
//     ready: function (fn) {
//         if (__document_ready__) {
//             fn.apply(null, arguments);
//         } else {
//             _ready_queue.push({fn: fn, args: arguments});
//         }
//     },
//
//     /*
//      * Module initialization.
//      */
//     initialize: function () {
//         dk.info("INITIALIZING...");
//         var self = this;
//         __document_ready__ = true;
//
//         for (var i = 0; i < _bind_q.length; i++) {
//             self.bind(_bind_q[i]);
//         }
//         _bind_q = [];
//         _ready_queue.forEach(function (item) {
//             // XXX: self.page
//             item.fn.apply(self.page, item.args);
//         });
//
//         if (_dktag.main) _dkrequire.js(_dktag.main);
//     },
//
//     /*
//      * Regular jQuery bind calls the function with this bound to the target object,
//      * which doesn't work for me.
//      *
//      * Usage:  dk.bind({ when: obj, triggers: 'event',  send: 'message', to: receiver })
//      */
//     bind: function (param) {
//         var self = this;
//         if (!__document_ready__) {
//             dk.log("Trying to call dk.bind before page is ready. Did you mean dk.page.bind()?",
// param); _bind_q.push(param); dk.log('---dk.bind:', param); return; } dk.log('dk.bind:', param);
// $(param.when).bind(param.triggers, function () { var args = arguments;
// Array.prototype.shift.call(args);  if (param.when.name) { dk.log(param.when.name + ': ' +
// param.triggers + ' -> ' + param.to.name + '.' + param.send, args); } else { dk.log(param.when,
// param.triggers, param.to, param.send, args); } if (param.to[param.send]) { if (param.convert) {
// args = param.convert.apply(param.when, args); if (!(args instanceof Array)) { args = [args]; } }
// param.to[param.send].apply(param.to, args); } else { dk.log('Missing method:', param.send, ' of
// ', param.to); } }); }  };
