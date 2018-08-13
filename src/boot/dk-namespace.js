/* global require, module */

const _ = require('lodash');


module.exports = {

    /*
     *  Create sub-namespaces.
     *
     *  Usage (creates and returns dk.my.sub.ns)::
     *
     *      myns = dk.namespace('my.sub.ns');
     *
     *  To create a namespace on e.g. window, use::
     *
     *      myns = dk.namespace.call(window, 'my.sub.ns');
     *
     *  value is optional and becomes the value of the last part of the
     *  dotted name (but only if it doesn't allready exist).
     *
     */
    create_namespace(dotted_name, value) {
        let parent = this;
        let parts = dotted_name.split('.');
        parts.forEach((part, i) => {
            if (parent[part] === undefined) {
                if (i === parts.length - 1 && value !== undefined) {
                    parent[part] = value;
                } else {
                    parent[part] = {};
                }
            }
            parent = parent[part];
        });
        return parent;
    },


    /*
     *  Look up the path in the object.
     *  path is a dotted string ('foo.bar.baz') that can start
     *  with `this`.
     */
    traverse(obj, path) {
        let pelems = path.split('.');
        let res = obj;
        pelems.forEach(function (item) {
            res = item === 'this' ? obj : res[item];
        });
        return res;
    },


    /*
     *  `update(a, b)` := a += b;    (automatically handles undefined a)
     *  (a, b) => (a || {}) += b; a;
     *  (i.e. `a` is updated with all members in `b`.)
     *
     */
    update(to_obj, ...from_objs) {
        return Object.assign(to_obj, ...from_objs);
    },
    
    
    /*
     *  Combine all argument namespaces to form a new namespace
     *  (i.e. same as update(..), but without clobbering the first argument)
     */
    combine(...args) {
        return Object.assign({}, ...args);
    },


    /*
     *  `merge()` creates a new dict by merging any number of dicts
     *  passed as arguments::
     *
     *      let opts = dk.merge({..defaults...}, argopts, overrides, ...);
     */
    merge: (function () {
        let parent_RE = /{#}/;  // a substitution
        let child_RE = /{_}/;   // a hole
        let _merge = {
            string: function (a, b) {
                if (child_RE.test(a) && parent_RE.test(b))
                    throw `You cannot specify both a hole ('${a}') and a substitution ('${b}').`;
                if (parent_RE.test(b)) {
                    return b.replace(parent_RE, a);
                }
                if (child_RE.test(a)) {
                    return a.replace(child_RE, b);
                }
                return b;
            },
            boolean: function (a, b) {
                // return a || b;
                return b;
            },
            object: function (a, b) {
                let res = {};
                for (let attr in a) if (a.hasOwnProperty(attr)) {
                    if (b.hasOwnProperty(attr)) {
                        res[attr] = _merge_ab(a[attr], b[attr]);
                    } else {
                        res[attr] = a[attr];
                    }
                }
                for (let attr in b) {
                    if (b.hasOwnProperty(attr) && !a.hasOwnProperty(attr)) {
                        res[attr] = b[attr];
                    }
                }
                return res;
            },
            array: function (a, b) {
                return a.concat(b);
            }
        };

        let _merge_ab = function (a, b) {
            if (_.isFunction(a) || _.isUndefined(a) || _.isNull(a))
                return b;

            if (typeof a !== typeof b)
                throw "incompatible types '%s' (%r) and '%s' (%r).".format(typeof a, a, typeof b, b);

            if (_.isString(a) && _.isString(b))
                return _merge.string(a, b);

            if (_.isBoolean(a) && _.isBoolean(b))
                return _merge.boolean(a, b);

            if (_.isArray(a) && _.isArray(b))
                return _merge.array(a, b);

            if (_.isObject(a) && _.isObject(b))
                return _merge.object(a, b);

            // default..
            return b;
        };

        return function () {
            if (arguments.length === 0)
                return undefined;
            let res = arguments[0];
            for (let i=1; i<arguments.length; i++) {
                let from_obj = arguments[i];
                if (from_obj) {
                    res = _merge_ab(res, from_obj);
                }
            }
            return res;
        };

    })()

};
