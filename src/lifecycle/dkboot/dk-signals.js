/*
 * Terminology:
 *
 *  publish/subscribe
 *  on/trigger
 *  listen/notify
 *  xx/emit
 *
 */

function _debugstr(obj) {
    let res = "";
    if (obj.tagName) {
        res += obj.tagName;
        if (obj.id) {
            res += '#' + obj.id;
        }
        return res;
    }
    return obj.toString();
}


const listeners = Symbol('listeners');

function _attach_listener(obj, signal, fn) {
    if (obj[listeners] === undefined) obj[listeners] = {};
    if (obj[listeners][signal] === undefined) obj[listeners][signal] = [];
    obj[listeners][signal].push(fn);
}


export default function setup_signals(dk, debuglevel) {
    const BINDING_NOTIFY_LEVEL = debuglevel;
    
    /*
     *  Execute `fn` once after next time obj.method() is called.
     *  `fn` receives the result of obj.method() as its argument and the
     *  return value of fn is substituted for the return value of obj.method().
     */
    dk.after = function (obj, method, fn) {
        let _meth = obj[method];
        obj[method] = function () {
            obj[method] = _meth;
            return fn(obj[method](arguments));
        };
    };
    
    /*
     *      dk.on(velrep, 'draw-end').run(velrep.FN('reset_bs_titles');
     */
    dk.on = function (obj, signal, optfn) {
        if (obj === null) return {run: function () {}};
        if (dk.DEBUG && dk.LOGLEVEL >= BINDING_NOTIFY_LEVEL) {
            if (obj && signal && optfn) {
                dk.debug(`dk.on(${_debugstr(obj)}, "${signal}", run: ${optfn.toString()})`);
            } else {
                dk.error("dk.on argument error:", obj, signal, optfn);
                throw new Error("Cannot listen on undefined object: " + obj);
            }
        }
        if (obj === undefined) {
            throw new Error("Cannot listen on undefined object: " + obj);
        }
        if (optfn !== undefined) {
            _attach_listener(obj, signal, optfn);
        } else {
            return {
                run: function (fn) {
                    _attach_listener(obj, signal, fn);
                }
            };
        }
    };
    

    
    dk.trigger = dk.globals.$trigger = function (obj, signal, ...args) {
        if (dk.DEBUG && dk.LOGLEVEL >= BINDING_NOTIFY_LEVEL + 1) {
            dk.debug(`dk.trigger(${_debugstr(obj)}, "${signal}", [${args}])`);
        }
        if (obj[listeners]) {
            if (obj[listeners][signal]) {
                obj[listeners][signal].forEach(function (fn) {
                    if (fn.name) {
                        dk.debug(`    run: ${fn.name}(${args})`);
                    }
                    fn.apply(null, args);
                });
            }
        }
    };
    
    /**
     * When `obj` emits `signal` (+ `args`), then call `fn(args)`.
     * -or- when `signal` is emitted on `obj`...
     * @param obj
     * @param signal    string
     * @param fn
     */
    dk.subscribe = function (obj, signal, fn) {
        dk.warn("dk.subscribe is deprecated, use dk.on(obj, signal, fn) instead.");
        return dk.on(obj, signal, fn);
    };
    
    dk.publish = function (obj, signal, ...args) {
        dk.warn("dk.publish is deprecated, use dk.trigger(obj, signal, ...args) instead.");
        return dk.trigger(obj, signal, ...args);
    };
    
}