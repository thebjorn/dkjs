/* eslint-disable no-empty,no-console */
/* global window */

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

import performance from "../../performance-timer";


export default function setup_console(dk) {
    
    // attach log levels directly onto dk
    Object.assign(dk, {
        ERROR: 0,
        WARN: 1,
        LOG: 2,
        INFO: 3,
        DEBUG: 4
    });
    
    const _nullfn = function () {};
    let loglevel = dk.LOGLEVEL;
    dk.error = _nullfn;
    dk.warn = _nullfn;
    dk.log = _nullfn;
    dk.info = _nullfn;
    dk.debug = _nullfn;
    dk.dir = _nullfn;
    
    if (loglevel >= dk.ERROR) {
        try {
            dk.error = window.console.error.bind(window.console);
        } catch (e) {}
    }
    if (loglevel >= dk.WARN) {
        try {
            dk.warn = window.console.warn.bind(window.console);
        } catch (e) {}
    }
    if (loglevel >= dk.LOG) {
        try {
            dk.log = window.console.log.bind(window.console);
        } catch (e) {}
    }
    if (loglevel >= dk.INFO) {
        try {
            dk.info = window.console.info.bind(window.console);
        } catch (e) {}
    }
    if (loglevel >= dk.DEBUG) {
        try {
            dk.debug = window.console.debug.bind(window.console);
        } catch (e) {}
        dk.dir = function dir(label, obj) {
            try {
                console.group(typeof label === 'string'? label: '');
                obj = arguments.length === 1 ? label : obj;
                console.dir(obj);
                console.groupEnd();
            } catch (e) {}
        };
    }
    dk.info(`set LOGLEVEL attribute on script tag to a smaller value to reduce logging, currently LOGLEVEL == ${loglevel}`);
    performance('dk-console');
}
