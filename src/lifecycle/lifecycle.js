
/**
 *   Startup semantics:
 *
 *     1.
 */
import performance from "../performance-timer";

// import _ from 'lodash';
// import {parse_src} from "./uri";
// import dkglobal from './dkglobal';
// import setup_console from './browser/dk-console';
// import namespace from './boot/dk-namespace';
// import setup_signals from "./boot/dk-signals";
// import discover_initial_environment from "./lifecycle-discover-initial-environment";
// import parse_script_tag from "./lifecycle-parse-script-tag";
// import create_debug_environment from "./lifecycle-create-debug-environment";
// import require from "./browser/dk-require";
import setup_loaders from "./lifecycle-setup-loaders";
import sys from "../sys";
import core from "../core";


class Lifecycle {
    constructor(dk, ctx) {
        dk.performance('lifecycle-start');

        // discover_initial_environment(dk, ctx);      // dk.globals, .webpage.scripts, .webpage.stylesheets
        // parse_script_tag(dk);                  // dk.DEBUG, .LOGLEVEL, .scripttag_attributes

        // console.info('dk.DEBUG = ', dk.DEBUG);
        // if (dk.DEBUG) {
        //     create_debug_environment(dk);
        // }
        // setup_console(dk);                      // add console
        // Object.assign(dk, {
        //     namespace
        // });  // add Class and namespace
        // setup_signals(dk, dk.debug ? dk.ERROR : dk.INFO);
        setup_loaders(dk, ctx);
        dk.sys = sys;
        dk.core = core;
        
        dk.lifecycle = this;
    }



    
    // verify_resources() {}
    // load_externals() {}
    // load_core() {}
    // initialize_page() {}
    // dk_ready() {}
    // dk_unload() {}
    
}

performance('lifecycle');
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
