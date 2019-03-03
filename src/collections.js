/**
 * Creates an object composed of the picked `object` properties.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The source object.
 * @param {...(string|string[])} [paths] The property paths to pick.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.pick(object, ['a', 'c']);
 * // => { 'a': 1, 'c': 3 }
 */
import is from "./is";

export function pick(object, paths) {
    if (object == null) return {};
    const res = {};
    paths.forEach(p => { res[p] = object[p]; });
    return res;
}


export function zip_object(props, values)  {
    return props.reduce((prev, prop, i) => {
        return Object.assign(prev, { [prop]: values[i] });
    }, {});
}


/**
 * Is target a subset of obj?
 * 
 * Usage::
 * 
 *      matches({a: 1, b:2}, {b:2}) ===> true
 *      matches({a: 1, b:2}, {b:3}) ===> false
 * 
 * @param obj
 * @param target
 */
export function matches(obj, target) {
    if (!is.isProps(target)) throw `target must be a plain object, not ${target}`;
    return Object.entries(target).map(([key, val]) => {
        if (!obj.hasOwnProperty(key)) return false;
        return obj[key] === val;
    }).every(v => !!v);
}

/**
 * Usage:
 * 
 *    var users = [
 *        { 'user': 'barney', 'age': 36, 'active': false, 'pets': ['hoppy'] },
 *        { 'user': 'fred',   'age': 40, 'active': true, 'pets': ['baby puss', 'dino'] }
 *    ];
 *    
 *    _.pluck(_.where(users, { 'age': 36, 'active': false }), 'user');
 *    // => ['barney']
 *    
 *    _.pluck(_.where(users, { 'pets': ['dino'] }), 'user');
 *    // => ['fred']
 * 
 * @param lst
 * @param src
 */
export function where(lst, src) {
    return lst.filter(obj => matches(obj, src));
}
