/* global window */


import _ from 'lodash';


export class CookieStorage {
    // mostly from https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Storage
    // compatible with ancient ie.
    constructor() {
        this.name = 'CookieStorage';
        this.length = 0;
    }
    
    get_item(key, defaultValue) {
        if (!key || !this.has_key(key)) {
            return defaultValue;
        }
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + encodeURIComponent(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
    }
    
    set_item(key, value) {
        if (!key) {
            return;
        }
        document.cookie = encodeURIComponent(key) + "=" + encodeURIComponent(value) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
        this.length = document.cookie.match(/=/g).length;
    }
    
    key(nKeyId) {
        return decodeURIComponent(document.cookie.replace(/\s*=(?:.(?!;))*$/, "").split(/\s*=(?:[^;](?!;))*[^;]?;\s*/)[nKeyId]);
    }
    
    remove_item(key) {
        if (!key || !this.has_key(key)) {
            return;
        }
        document.cookie = encodeURIComponent(key) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        this.length--;
    }
    
    has_key(key) {
        return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(key).replace(/[\-.+*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    }
}


export class LocalStorage {
    constructor(engine) {
        this.name = 'LocalStorage';
        this.engine = engine || window.localStorage;
    }

    set_item(key, value) {
        try {
            this.engine.setItem(key, window.JSON.stringify(value));
        } catch (e) {}
    }

    get_item(key, defaultValue) {
        const value = this.engine.getItem(key);
        return value ? JSON.parse(value) : (defaultValue || undefined);
    }
}


export class SessionStorage extends LocalStorage {
    constructor(engine) {
        super(engine || window.sessionStorage);
        this.name = 'SessionStorage';
    }
}


export class HashStorage {
    constructor() {
        this.name = 'HashStorage';
        this.values = {};
    }
    
    encode(val) {
        return JSON.stringify(val);
        return window.btoa(JSON.stringify(val));
        // let res = "";
        // if (_.isString(val)) {
        //     return val;
        // } else if (_.isNumber(val)) {
        //     return "" + val;
        // } else if (_.isArray(val)) {
        //     return '[' + val.map(v => this.encode(v)).join("|") + ']';
        // } else if (_.isObject(val)) {
        //     res += '{';
        //     for (const attr in val) if (val.hasOwnProperty(attr)) {
        //         res += attr + '=' + this.encode(val[attr]) + ';';
        //     }
        //     return res + '}';
        // } else {
        //     return JSON.stringify(val);
        // }
    }
    
    decode(val) {
        return JSON.parse(val);
        return JSON.parse(window.atob(val));
    }
    
    set_item(key, value) {
        if (!key || typeof key !== "string") {
            throw `dk.State.set_item: key (${key}) must be strings, not ${typeof key}`;
        }
        this.values[key] = value;
        //var strval = this.encode(this.values);
        //document.location.hash = encodeURIComponent(strval);
        //document.location.hash = decodeURIComponent($.param(item));
        //document.location.hash = encodeURIComponent(JSON.stringify(values));
        document.location.hash = this.encode(this.values);
    }
    
    get_item(key, defaultValue) {
        const h = document.location.hash.substring(1);
        const s = decodeURIComponent(h);
        const v = JSON.parse(s || '{}');
        return v[key] || defaultValue;
    }
}


export class State {
    constructor(engine, name) {
        console.info("ENGINE:", engine, "NAME:", name, "TP:", typeof engine);
        this.name = name;
        this.state = {};
        this._laststate = null;
        this.engine = engine || (new LocalStorage());
        console.info("THIS:ENGINE:", this.engine);
    }
    
    get_item(key, defaultValue) {
        const val = this.engine.get_item(key, defaultValue);
        // console.info("VAL:", val, "KEY:", key);
        if (val === defaultValue) {
            this.engine.set_item(key, val);
        }
        this.state[key] = val;
        return val;
    }
    
    set_item(key, val) {
        this.engine.set_item(key, val);
        this.state[key] = val;
    }
    

    substate(name) {
        const self = this;
        const state = this.engine.get_item(name, {});
        this.engine.set_item(name, state);
        return {
            set: function (k, v) {
                state[k] = v;
                self.engine.set_item(name, state);
            },
            get: function (k) {
                return state[k];
            }
        };
    }
    changed() {
        return this._laststate !== JSON.stringify(this.state);
    }
    set_state(s) {
        this.state = s;
        this.save();
    }
    save() {
        if (this.changed()) {
            this.engine.set_item(this.name || 'dk_state', this.state);
            this._laststate = JSON.stringify(this.state);
        }
    }
    restore() {
        this.state = this.engine.get_item(this.name || 'dk_state', {});
        this._laststate = JSON.stringify(this.state);
        return this.state;
    }
}


export default {
    storage: {
        cookie: CookieStorage,
        local: LocalStorage,
        session: SessionStorage,
        hash: HashStorage
    },
    State
};
