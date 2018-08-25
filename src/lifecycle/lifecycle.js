

import parse_uri from "./uri";


function find_version(uriobj) {
    let match = /[-.@\/](\d+\.\d+\.\d+)[.\/]/.exec(uriobj.name);
    if (match) return match[1];
    
    match = /[-.@\/](\d+\.\d+\.\d+)[.\/]/.exec(uriobj.path);
    if (match) return match[1];
    
    match = /\/v(\d)\//.exec(uriobj.name);
    if (match) return match[1];
    
    return null;
}

function is_minified(uriobj) {
    return /[-.]min[-.]/.test(uriobj.name);
}

function plain_name(urlobj) {
    let res = urlobj.name.replace(/[-.]min[-.]/, '.');
    res = res.replace(/[-.@\/](\d+\.\d+\.\d+)[.\/]?/, '');
    return res;
}

function parse_src(uri) {
    const src = parse_uri(uri);
    src.version = find_version(src);
    src.libname = plain_name(src);
    src.minified = is_minified(src);
    return src;
}

class Lifecycle {
    constructor() {
        this.page = {scripts:{}, css:[]};
        this.parse_script_tag();
        let dk = this.page.scripts.dk.script;
        this.scriptattrs = {debug: 0, crossorigin: false, onload: null};
        // node.attributes cannot for-of on IE
        for (let i=0; i<dk.attributes.length; i++) {
            const attr = dk.attributes[i];
            switch (attr.name) {
                case 'debug':
                    // <script debug src=..> => debug===4
                    this.scriptattrs.debug = parseInt(attr.value || "4", 10);
                    break;
                case 'crossorigin':
                    this.scriptattrs.crossorigin = !!attr.value;
                    break;
                default:
                    this.scriptattrs[attr.name] = attr.value;
                    break;
            }
        }
    }
   
    parse_script_tag() {
        // node.attributes cannot for-of on IE
        for (let i=0; i<document.scripts.length; i++) {
            const script = document.scripts[i];
            let stag = parse_src(script.getAttribute('src'));
            stag.script = script;
            if (stag.libname in this.page.scripts) {
                throw `Script included multiple times:
                    ${stag.source}
                    ${this.page.scripts[stag.libname].source}
                `;
            }
            this.page.scripts[stag.libname] = stag;
        }
    }
    
    // verify_resources() {}
    // load_externals() {}
    // load_core() {}
    // initialize_page() {}
    // dk_ready() {}
    // dk_unload() {}
    
}
const lifecycle = new Lifecycle();
export default lifecycle;

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
//             dk.log("Trying to call dk.bind before page is ready. Did you mean dk.page.bind()?", param);
//             _bind_q.push(param);
//             dk.log('---dk.bind:', param);
//             return;
//         }
//         dk.log('dk.bind:', param);
//         $(param.when).bind(param.triggers, function () {
//             var args = arguments;
//             Array.prototype.shift.call(args);
//
//             if (param.when.name) {
//                 dk.log(param.when.name + ': ' + param.triggers + ' -> ' + param.to.name + '.' + param.send, args);
//             } else {
//                 dk.log(param.when, param.triggers, param.to, param.send, args);
//             }
//             if (param.to[param.send]) {
//                 if (param.convert) {
//                     args = param.convert.apply(param.when, args);
//                     if (!(args instanceof Array)) {
//                         args = [args];
//                     }
//                 }
//                 param.to[param.send].apply(param.to, args);
//             } else {
//                 dk.log('Missing method:', param.send, ' of ', param.to);
//             }
//         });
//     }
//
// };
