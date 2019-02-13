// LVL:0
// "use strict";
/*
Start of es2015 version of dk base class.
(cf. http://stackoverflow.com/questions/31325134/is-there-a-way-to-discover-if-a-javascript-6-class-defines-its-own-constructor)

Usage::
    
    class Person extends Class {
        constructor(name) {
            super();
            this.name = name;
        }
    }

    var p = Person.create('roger');
    console.log(p.name, p instanceof Person, p.DEFINES('name'), p.__proto__);

    var c = Class.create({
        name: 'hello',
        foo: x => console.log(this.name, x)
    });

*/

import performance from "../../performance-timer";

/**
 * Set the name property of obj.
 * @param obj
 * @param name
 * @private
 */
function _set_name(obj, name) {
    Object.defineProperty(obj, 'name', {
        configurable: true,
        enumerable: false,
        writable: false,
        value: name
    });
}


/**
 * class decorator to add class attributes.
 * 
 * @param props
 * @returns {function(*): {kind: string, elements: (*|HTMLCollection|HTMLFormControlsCollection|ActiveX.ISchemaItemCollection)}}
 */
export function classattrs(props) {
    return function decorator(cls) {
        if (cls.kind !== 'class') throw `not class ${cls.kind}`;
        Object.entries(props).forEach(([k, v]) => {
            cls.elements.push({
                kind: 'field',
                key: k,
                placement: 'static',
                descriptor: {
                    configurable: true,
                    enumerable: true,
                    writable: true
                },
                initializer: () => v
            });
        });
        return {
            kind: 'class',
            elements: cls.elements
        };
    };
}

class _mergeobject {
    constructor({op}) {
        this.op = op;
    }
}


const $attr = {
    append: function (item) {
        return new _mergeobject({
            op: function (orig) {
                orig.push(item);
                return orig;
            }
        });
    },
    extend: function (item) {
        return new _mergeobject({
            op: function (orig) {
                return namespace.merge(orig, item);
            }
        });
    },
    merge: function (item) {
        return new _mergeobject({
            op: function (orig) {
                return namespace.merge(orig, item);
            }
        });
    }
};


export default class Class {
    constructor(props) {
        this.__class__ = this.constructor;
        if (typeof props === 'object') {
            for (const attr in props) if (props.hasOwnProperty(attr)) {
                let propval = props[attr];
                if (propval instanceof _mergeobject) {
                    const classval = this[attr] ? this[attr]: [];
                    propval = propval.op(classval);
                }
                this[attr] = propval;
            }
        }
        // Object.assign(this, props || {});
        if (this.init !== undefined) this.init(props);
    }
    
    DEFINES(fn_name) {
        return fn_name in this && typeof this[fn_name] === 'function';
    }
    
    FN(fn_name) {
        let meth = this[fn_name];
        /* istanbul ignore else */
        if (meth) {
            let fn = meth.bind(this);
            _set_name(fn, Object.getPrototypeOf(this).constructor.name + '.' + fn_name);
            return fn;
        } else {
            return function () {};
        }
    }
    
    static create(...args) {
        // first handle X y = X(); X x = X(y); (we don't want a copy ctor)
        if (args.length === 1 && args[0] instanceof this) return args[0];
        let obj = new this(...args);
        if (obj.init !== undefined) obj.init(...args);
        return obj;
    }

    static extend(props) {
        let classattrs = props['classattrs'];
        delete props['classattrs'];
        
        let _classname = props.__name__; // || this.name;
        // let _classname = props.__name__ || this.name;
        delete props.__name__;
        
        let classname = _classname ? _classname : ('(missing __name__ attribute) SubclassOf' + this.name);
        class SubClass extends this {}
        _set_name(SubClass, classname);
        
        // set (overwrite) subclass instance attributes on prototype
        Object.getOwnPropertyNames(props).forEach(prop => {
            let d = Object.getOwnPropertyDescriptor(props, prop);
            Object.defineProperty(SubClass.prototype, prop, d);
        });
        
        // make class attributes of everything defined in `classattrs`.
        for (let cattr in classattrs) {
            // noinspection JSUnfilteredForInLoop
            SubClass[cattr] = classattrs[cattr];
        }
        
        // class method
        SubClass.toString = () => SubClass.name;
        return SubClass;
    }
}

performance('dk-class');
