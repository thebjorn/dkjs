// from can-define-lazy-value

/**
 * @signature `defineLazyValue(obj, prop, fn, writable)`
 *
 * Use Object.defineProperty to define properties whose values will be created lazily when they are first read.
 *
 * ```js
 * var _id = 1;
 * function getId() {
 *     return _id++;
 * }
 *
 * function MyObj(name) {
 *     this.name = name;
 * }
 *
 * defineLazyValue(MyObj.prototype, 'id', getId);
 *
 * var obj1 = new MyObj('obj1');
 * var obj2 = new MyObj('obj2');
 *
 * console.log( obj2 ); // -> { name: "obj2" }
 * console.log( obj1 ); // -> { name: "obj1" }
 *
 * // the first `id` read will get id `1`
 * console( obj2.id ); // -> 1
 * console( obj1.id ); // -> 2
 *
 * console.log( obj2 ); // -> { name: "obj2", id: 1 }
 * console.log( obj1 ); // -> { name: "obj1", id: 2 }
 *
 * ```
 *
 * @param {Object} obj The object to add the property to.
 * @param {String} prop   The name of the property.
 * @param {Function} initializer   A function to get the value the property should be set to.
 * @param {boolean} writable   Whether the field should be writable (false by default).
 */
export default function define_lazy_value(obj, prop, initializer, writable) {
    Object.defineProperty(obj, prop, {
        configurable: true,
        get: function () {
            Object.defineProperty(this, prop, {
                value: undefined,
                writable: true
            });
            const value = initializer.call(this, obj, prop);
            Object.defineProperty(this, prop, {
                value: value,
                writable: !!writable
            });
            return value;
        },
        set: function (value) {
            Object.defineProperty(this, prop, {
                value: value,
                writable: !!writable
            });
            return value;
        }
    });
};
