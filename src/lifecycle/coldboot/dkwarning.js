
const _seen_warnings = {};


export function dkwarning(msg) {
    if (!_seen_warnings[msg]) {
        _seen_warnings[msg] = true;
        const stack = new Error().stack;  // IE11 will give undefined, works everywhere else
        // eslint-disable-next-line no-console
        console.warn(msg, stack);
        return msg;
    } else {
        return "";
    }
}
