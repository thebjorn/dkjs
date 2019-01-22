/**
 * Storage implementations should follow the following semantics
 * 
 *   - values (get/set dict value)
 */
// import Storage from "./storage-base";
import cookie from "./dk-cookie";

export function encode_url_value(val) {
    return encodeURIComponent(JSON.stringify(val));
}

export function decode_url_value(val) {
    try {
        return JSON.parse(decodeURIComponent(val));
    } catch (e) {
        // console.error(`VALUE: [${val}] (${typeof val})`);
        throw e;
    }
}


export class CookieStorage {
    constructor() {
        this.name = 'CookieStorage';
    }

    get values() {
        return this.get_item('dkstate', {});
    }

    save_values(name, vals) {
        this.set_item('dkstate', vals);
    }

    get_item(key, defaultValue) {
        if (!key || !this.has_key(key)) {
            return defaultValue;
        }
        return decode_url_value(cookie.get(key, {raw: true}));
        // return decode_url_value(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + encodeURIComponent(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
    }

    set_item(key, value) {
        if (!key) return;
        cookie.set(key, encode_url_value(value), {expires: "Tue, 19 Jan 2038 03:14:07 GMT", path:"/", raw: true});
        // document.cookie = `${encodeURIComponent(key)}=${encode_url_value(value)}; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/`;
        // this.length = document.cookie.match(/=/g).length;
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
        this.name_prefix = 'dks-';
        this.engine = engine || window.localStorage;
    }

    get values() {
        const res = {};
        Object.keys(this.engine).forEach(k => {
            if (k.slice(0, this.name_prefix.length) === this.name_prefix) {
                res[k.slice(this.name_prefix.length)] = this.get_item(k);
            }
        });
        return res;
    }

    save_values(name, vals) {
        Object.entries(vals).forEach(([key, val]) => {
            this.set_item(this.name_prefix + key, val);
        });
    }

    set_item(key, value) {
        try {
            this.engine.setItem(key, JSON.stringify(value));
        } catch (e) {
            throw e;
        }
    }

    get_item(key, defaultValue) {
        const value = this.engine.getItem(key);
        return value ? JSON.parse(value) : defaultValue;
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
    }
    
    get values() {
        const hash_fragment = document.location.hash.substring(1);
        if (hash_fragment === "") return {};
        return decode_url_value(hash_fragment);
    }
    
    save_values(name, vals) {
        // name is not used in the HashStorage engine.
        document.location.hash = encode_url_value(vals);
    }

    get_item(key, defaultValue) {
        return v[key] || defaultValue;  // XXX: fixme
    }
    
    set_item(key, value) {
        if (!key || typeof key !== "string") {
            throw `dk.State.set_item: key (${key}) must be strings, not ${typeof key}`;
        }
        document.location.hash = encode_url_value(this.values);  // XXX: fixme
    }
}
