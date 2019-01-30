
/*
 *  Wrappers for console.log|warn|info|debug
 *
 *  You must add the DEBUG attribute to the script tag, or define
 *  `window.DEBUG` for this module to write anything
 *
 *     <script DEBUG src="/dkjs/dk/dk.js"></script>
 *
 *   you can get less verbose logging by setting the LOGLEVEL to a lower value
 *   (default == 4 which logs everything). E.g. to only log warnings::
 *
 *       <script DEBUG LOGLEVEL=2 src="/dkjs/dk/dk.js"></script>
 *
 *   DEBUG and LOGLEVEL can also be set as global variables.
 *
 */

import dkglobal from "../dkglobal";
import {env, loglevels} from "./lifecycle-parse-script-tag";


export const dkconsole = {
    error(...args) {
        if (env.LOGLEVEL >= loglevels.ERROR && dkglobal.console && dkglobal.console.error) dkglobal.console.error(...args);
    },
    warn(...args) {
        if (env.LOGLEVEL >= loglevels.WARN && dkglobal.console && dkglobal.console.warn) dkglobal.console.warn(...args);
    },
    log(...args) {
        if (env.LOGLEVEL >= loglevels.LOG && dkglobal.console && dkglobal.console.log) dkglobal.console.log(...args);
    },
    info(...args) {
        if (env.LOGLEVEL >= loglevels.INFO && dkglobal.console && dkglobal.console.info) dkglobal.console.info(...args);
    },
    debug(...args) {
        if (env.LOGLEVEL >= loglevels.DEBUG && dkglobal.console && dkglobal.console.debug) dkglobal.console.debug(...args);
    },
    dir(...args) {
        if (env.LOGLEVEL >= loglevels.DEBUG && dkglobal.console && dkglobal.console.dir) {
            if (!dkglobal.console.group || args.length === 0) {
                dkglobal.console.dir(...args);
            } else {
                let [label, ...rest] = args;
                dkglobal.console.group(typeof label === 'string'? label: '');
                const obj = args.length === 1 ? label : rest;
                dkglobal.console.dir(obj);
                dkglobal.console.groupEnd();
            }
        }
    }
};

// export default function setup_console() {
//     let loglevel = env.LOGLEVEL;
//     const dkconsole = {
//         error: _nullfn,
//         warn: _nullfn,
//         log: _nullfn,
//         info: _nullfn,
//         debug: _nullfn,
//         dir: _nullfn
//     };
//    
//     if (loglevel >= loglevels.ERROR && window.console.error) {
//         dkconsole.error = window.console.error.bind(window.console);
//     }
//     if (loglevel >= loglevels.WARN && window.console.warn) {
//         dkconsole.warn = window.console.warn.bind(window.console);
//     }
//     if (loglevel >= loglevels.LOG && window.console.log) {
//         dkconsole.log = window.console.log.bind(window.console);
//     }
//     if (loglevel >= loglevels.INFO && window.console.info) {
//         dkconsole.info = window.console.info.bind(window.console);
//     }
//     if (loglevel >= loglevels.DEBUG && window.console.debug) {
//         dkconsole.debug = window.console.debug.bind(window.console);
//         dkconsole.dir = function dir(label, obj) {
//             try {
//                 console.group(typeof label === 'string'? label: '');
//                 obj = arguments.length === 1 ? label : obj;
//                 console.dir(obj);
//                 console.groupEnd();
//             } catch (e) {}
//         };
//     }
//     dkconsole.info(`set LOGLEVEL attribute on script tag to a smaller value to reduce logging, currently LOGLEVEL == ${loglevel}`);
//     performance('dk-console');
// }
