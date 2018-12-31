/**
 *  Usage:  $(window).resize(dk.throttle(250, widget.resize, false));
 *
 * @param delay
 * @param callback
 * @param debounce_mode - false: only call callback once, at end.
 *                      - undefined: call callback every 250 ms, + final time at end
 *                      - true: call callback once at beginning only.
 * @returns {debounce_function}
 */
export function throttle(delay, callback, debounce_mode, ...args) {
    // based on throttle-debounce plugin
    let timeout_id, last_exec = 0; // , no_trailing = false;
    let self = this;
    
    function debounce_function() {
        let elapsed = +new Date() - last_exec;
        
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
