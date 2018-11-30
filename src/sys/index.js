import ctor_apply from "./ctor-apply";


export function is_function(object) {
    return !!(object && object.constructor && object.call && object.apply);
}


/**
 *  Usage:  $(window).resize(dk.throttle(250, widget.resize, false);
 *
 * @param delay
 * @param callback
 * @param debounce_mode - false: only call callback once, at end.
 *                      - undefined: call callback every 250 ms, + final time at end
 *                      - true: call callback once at beginning only.
 * @returns {debounce_function}
 */
export function throttle(delay, callback, debounce_mode) {
    // based on throttle-debounce plugin
    let timeout_id, last_exec = 0; // , no_trailing = false;
    let self = this;
    
    function debounce_function() {
        let elapsed = +new Date() - last_exec, args = arguments;
        
        function exec() {
            last_exec = +new Date();
            callback.apply(self, args);
        }
        
        function clear() {timeout_id = undefined; }
        
        if (debounce_mode && !timeout_id) { exec(); }
        
        if (timeout_id) clearTimeout(timeout_id);
        
        if (debounce_mode === undefined && elapsed > delay) {
            exec();
        }
        timeout_id = setTimeout(
            debounce_mode ? clear : exec,
            debounce_mode === undefined ? delay - elapsed : delay
        );
    }
    
    return debounce_function;
}

/**
 *
 * let widgets = {a: <...>, b: <...>, ...};
 * dk.mcall(widgets, 'redraw', self);
 *
 * => widgets.a.redraw(self); widgets.b.redraw(self); ...;
 *
 * @param obj
 * @param method
 * @param args
 */
export function mcall(obj, method, ...args) {
    let result = {};
    
    for (const field of obj) {
        let item = obj[field];
        if (item[method]) {
            result[field] = item[method].apply(item, args);
        }
    }
    return result;
}

/**
 *  Convert instance to plain old javascript object.
 */
export function cls2pojo(obj) {
    const res = {};
    for (const attr of obj) {
        if (!is_function(obj[attr]) && attr !== 'type' && !/^_.*$/.test(attr)) {
            res[attr] = obj[attr];
        }
    }
    return res;
}


export default  {
    ctor_apply,
    cls2pojo,
    mcall,
    throttle,
    is_function
};
