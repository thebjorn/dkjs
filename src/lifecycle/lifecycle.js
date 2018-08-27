
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


class Lifecycle {
    constructor(dk, attrs) {
        this.page = {scripts: {}, css: []};
        
        // save global vars (or undefined)
        let DEBUG = dkglobal.DEBUG;
        let LOGLEVEL = dkglobal.LOGLEVEL;
        
        this.env = {
            DEBUG: false,
            LOGLEVEL: null,
            crossorigin: null,
            globals: dkglobal
        };

        this.parse_script_tag();
        // global vars override script tag vars
        if (typeof DEBUG !== 'undefined') this.env.DEBUG = DEBUG;
        if (typeof LOGLEVEL !== 'undefined') this.env.LOGLEVEL = LOGLEVEL;
        
        const array_intersection = (a, b) => {
            b = new Set(b);
            return new Set(a.filter(x => b.has(x)));
        };
        const set_empty = s => s.size === 0;
        
        Object.assign(dk, this.env);            // add dkjs tag attributes
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

        setup_console(dk);                      // add console
        Object.assign(dk, {Class, namespace});  // add Class and namespace
        setup_signals(dk, dk.debug ? dk.ERROR : dk.INFO);
        
        dk.lifecycle = this;
    }
    
    parse_script_tag() {
        // node.attributes cannot for-of on IE
        _.each(document.scripts, script => {
            let stag = parse_src(script.getAttribute('src'));
            stag.script = script;
            if (stag.libname in this.page.scripts) {
                throw `Script included multiple times:
                    ${stag.source}
                    ${this.page.scripts[stag.libname].source}
                `;
            }
            this.page.scripts[stag.libname] = stag;
        });
        
        let dk = this.page.scripts.dk.script;
        
        _.each(dk.attributes, attr => {  // node.attributes cannot for-of on IE
            switch (attr.name) {
                case 'DEBUG':
                    // <script debug src=..> => debug===4
                    this.env.DEBUG = true;
                    break;
                case 'LOGLEVEL':
                    // <script debug src=..> => debug===4
                    this.env.loglevel = parseInt(attr.value || "4", 10);
                    break;
                case 'crossorigin':
                    this.env.crossorigin = attr.value;
                    break;
                case 'data-main':
                    let val = attr.value;
                    if (val.slice(-val.length) !== '.js') {
                        val += '.js';
                    }
                    this.env[attr.name] = val;
                    break;
                default:
                    this.env[attr.name] = attr.value;
                    break;
            }
        });
        if (this.env.LOGLEVEL === null) {
            this.env.LOGLEVEL = this.env.DEBUG ? 4 : 0;
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
