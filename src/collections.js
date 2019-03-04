
import is from "./is";
import {array_intersection, set_equal} from "./lifecycle/set-ops";


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
 * 
 *  * _.pick(object, ['a']);
 * // => { 'a': 1 }
 * 
 *  * _.pick(object, 'a');  // shortcut when second arg is of length 1
 * // => { 'a': 1 }
 */
export function pick(object, paths) {
    if (object == null) return {};
    if (!Array.isArray(paths)) paths = [paths];
    const res = {};
    paths.forEach(p => { res[p] = object[p]; });
    return res;
}


/**
 * Return the values (only) from a pick with the same arguments.
 * @param object
 * @param paths
 */
export function pluck(lst, path) {
    return lst.map(obj => {
        const vals = Object.values(pick(obj, path));
        return vals.length === 1 ? vals[0] : vals;
    });
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
    function matches_array(src, trg) {
        // console.log("INTERSECTION:", src, trg, array_intersection(src, trg));
        // console.log("SET:TRG:", new Set(trg));
        // console.log("SET:EQUAL:", array_intersection(src, trg) === new Set(trg));
        return set_equal(array_intersection(src, trg), new Set(trg))
    }
    
    function matches_object(src, trg) {
        if (!is.isProps(trg)) throw `target must be a plain object, not ${trg}`;
        return Object.entries(trg).map(([key, val]) => _matches(src[key], val)).every(v => !!v);
    }
    
    function _matches(src, trg) {
        if (Array.isArray(trg)) {
            return matches_array(src, trg);
        }
        if (is.isProps(trg)) {
            return matches_object(src, trg);
        }
        return src === trg;
    }
    
    return _matches(obj, target);
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
