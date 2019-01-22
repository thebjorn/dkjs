// LVL:0

/**
 *  Get notified when any properties directly attached to the object
 *  changes.
 */
export function shallow_observer(obj, fn) {
    return new Proxy(obj, {
        set(target, name, val) {
            target[name] = val;
            if (fn) fn(target, name, val);
            return true;
        }
    });
}


const type_name = function (obj) {
    // ({}).toString.call(42) === "[object Number]"
    return ({}).toString.call(obj).split(' ')[1].slice(0, -1);
};

const is_nested = function (obj) {
    let tname = type_name(obj);
    return tname === 'Object' || tname === 'Array';
};

/**
 * Return an object such that any modifications to that object calls `fn`.
 *
 */
export function deep_observer(obj, fn, original_obj) {
    if (original_obj === undefined) original_obj = obj;
    switch (type_name(obj)) {
        case 'Object':
            Object.keys(obj).forEach(k => {
                if (is_nested(obj[k])) obj[k] = deep_observer(obj[k], fn, original_obj);
            });
            break;
        case 'Array':
            obj.forEach((v, i) => {
                if (is_nested(v)) obj[i] = deep_observer(v, fn , original_obj);
            });
            break;
    }
    
    return new Proxy(obj, {
        set(target, name, val) {
            if (is_nested(val)) val = deep_observer(val, fn, original_obj);
            target[name] = val;
            if (fn) fn(original_obj, target, name, val);
            return true;
        }
        // ,
        // get(target, name) {
        //     console.log('proxy-get:', target, 'name:', name);
        //     return target[name];
        // }
    });
}
