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


export function _ie11_deep_observer(obj, fn, original_obj, _pth) {
    if (_pth === undefined) _pth = '';
    if (original_obj === undefined) original_obj = obj;
    
    const proxy = {};
    switch (type_name(obj)) {
        case 'Object':
            Object.keys(obj).forEach(k => {
                if (is_nested(obj[k])) obj[k] = _ie11_deep_observer(obj[k], fn, original_obj, _pth + '.' + k);
            });
            break;
        case 'Array':
            obj.forEach((v, i) => {
                if (is_nested(v)) obj[i] = _ie11_deep_observer(v, fn , original_obj, _pth + `[${i}]`);
            });
            break;
    }
    
    for (const prop in obj) if (obj.hasOwnProperty(prop)) {
        Object.defineProperty(proxy, prop, {
            get: function() { return obj[prop]; },
            set: function(v) {
                obj[prop] = v;
                if (fn) fn(original_obj, obj, prop, v, _pth + '.' + prop);
            }
        });
    }
    
    return proxy;
}


/**
 * Return an object such that any modifications to that object calls `fn`.
 *
 */
function _deep_observer(obj, fn, original_obj, _pth) {
    if (_pth === undefined) _pth = '';
    if (original_obj === undefined) original_obj = obj;
    switch (type_name(obj)) {
        case 'Object':
            Object.keys(obj).forEach(k => {
                if (is_nested(obj[k])) obj[k] = _deep_observer(obj[k], fn, original_obj, _pth + '.' + k);
            });
            break;
        case 'Array':
            obj.forEach((v, i) => {
                if (is_nested(v)) obj[i] = _deep_observer(v, fn , original_obj, _pth + `[${i}]`);
            });
            break;
    }
    
    return new Proxy(obj, {
        set(target, name, val) {
            if (is_nested(val)) val = _deep_observer(val, fn, original_obj, _pth + '.' + name);
            target[name] = val;
            if (fn) fn(original_obj, target, name, val, _pth + '.' + name);
            return true;
        }
    });
}


export function deep_observer(...args) {
    if (!window.ActiveXObject && "ActiveXObject" in window) {
        // IE11
    } else {
        return _deep_observer(...args);
    }
}
