
// const lifecycle = new Lifecycle();
// export default lifecycle;


// var dk = require('../boot');

// var _dktag = require('../boot/dk-dkjsinclude.js');
// var _dkrequire = require('../boot/dk-require.js');


import {dkconsole} from "./dkboot/dk-console";
import {env} from "./dkboot/lifecycle-parse-script-tag";
import {dkwarning} from "./coldboot/dkwarning";

let __document_ready__ = false;
const _ready_queue = [];
let _bind_q = [];


export const dkmodule = {

    ready: function (fn) {
        if (__document_ready__) {
            fn.apply(null, arguments);
        } else {
            _ready_queue.push({fn: fn, args: arguments});
        }
    },

    /*
     * Module initialization.
     */
    initialize: function () {
        dkconsole.info("INITIALIZING...");
        __document_ready__ = true;

        for (let i=0; i<_bind_q.length; i++) {
            this.bind(_bind_q[i]);
        }
        _bind_q = [];
        _ready_queue.forEach(item => {
            item.fn.apply(this.page, item.args);
        });

        if (env.attrs.main) _dkrequire.js(env.attrs.main);
    },

    /*
     * Regular jQuery bind calls the function with this bound to the target object,
     * which doesn't work for me.
     *
     * Usage:  dk.bind({ when: obj, triggers: 'event',  send: 'message', to: receiver })
     */
    bind: function (param) {
        dkwarning(`lifecycle.bind has been called with ${param}`);
        // var self = this;
        // if (!__document_ready__) {
        //     dk.log("Trying to call dk.bind before page is ready. Did you mean dk.page.bind()?", param);
        //     _bind_q.push(param);
        //     dk.log('---dk.bind:', param);
        //     return;
        // }
        // dk.log('dk.bind:', param);
        // $(param.when).bind(param.triggers, function () {
        //     var args = arguments;
        //     Array.prototype.shift.call(args);
        //
        //     if (param.when.name) {
        //         dk.log(param.when.name + ': ' + param.triggers + ' -> ' + param.to.name + '.' + param.send, args);
        //     } else {
        //         dk.log(param.when, param.triggers, param.to, param.send, args);
        //     }
        //     if (param.to[param.send]) {
        //         if (param.convert) {
        //             args = param.convert.apply(param.when, args);
        //             if (!(args instanceof Array)) {
        //                 args = [args];
        //             }
        //         }
        //         param.to[param.send].apply(param.to, args);
        //     } else {
        //         dk.log('Missing method:', param.send, ' of ', param.to);
        //     }
        // });
    }

};
