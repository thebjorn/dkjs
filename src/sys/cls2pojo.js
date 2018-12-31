export function is_function(object) {
    return !!(object && object.constructor && object.call && object.apply);
}

/**
 *  Convert instance to plain old javascript object.
 */
export function cls2pojo(obj) {
    const res = {};
    Object.entries(obj).forEach(([attr, val]) => {
        if (!is_function(val) && attr !== 'type' && !/^_.*$/.test(attr)) {
            res[attr] = val;
        }
    });
    return res;
}
