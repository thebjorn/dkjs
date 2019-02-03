
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
