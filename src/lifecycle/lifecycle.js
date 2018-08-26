
/**
 *   Startup semantics:
 *
 *     1.
 */
import _ from 'lodash';
import {parse_src} from "./uri";
import dkglobal from './dkglobal';
import setup_console from './browser/dk-console';


class Lifecycle {
    constructor(dk, attrs) {
        this.page = {scripts: {}, css: []};
        
        // save global vars (or undefined)
        let DEBUG = dkglobal.DEBUG;
        let LOGLEVEL = dkglobal.LOGLEVEL;
        
        this.env = {
            debug: false,
            loglevel: null,
            crossorigin: null,
            globals: dkglobal
        };

        this.parse_script_tag();
        // global vars override script tag vars
        if (typeof DEBUG !== 'undefined') this.env.debug = DEBUG;
        if (typeof LOGLEVEL !== 'undefined') this.env.loglevel = LOGLEVEL;

        Object.assign(dk, this.env);
        
        setup_console(dk);
        
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
                case 'debug':
                    // <script debug src=..> => debug===4
                    this.env.debug = true;
                    break;
                case 'loglevel':
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
        if (this.env.loglevel === null) {
            this.env.loglevel = this.env.debug ? 4 : 0;
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
