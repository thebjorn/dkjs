// LVL:0

let _counters = {
    _default: 1
};

/**
 *  Return a unique counter value.
 *  The optional 'name' parameter, will create a label
 *  'name'<counter>, where the counter starts from startval
 *  (default 1).
 *
 * @param {string}  name - the name of the counter.
 * @param {int}     startval - the starting value (default=1).
 * @returns {string}
 */
function counter(name, startval=0) {
    if (!name && !startval) return _counters._default++;
    if (!_counters[name]) {
        if (!startval) startval = 1;
        _counters[name] = startval;
    }
    return name + _counters[name]++;
}

export function _reset_counters() {
    _counters = {_default: 1};
}

export default counter;
