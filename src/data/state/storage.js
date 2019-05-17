import {decode_url_value, encode_url_value} from "./serializers";


export class StorageBase {
    constructor() {
        this.encode = encode_url_value;
        this.decode = decode_url_value;
        
        this.capabilities = {
            flat: false,            // is the key namespace flat (must emulate foo.bar syntax)
            typed: true,            // are the values stored as strings (false)
            write_all: false,       // if true then the entire state must be saved to store every value
            max_keys: null,         // number of items we can store
            max_total_size: null,   // max size of all keys + values
            max_value_size: null,   // max size of an individual value
        };

    }

    // default implementations (you can override these)
    get(key, default_value) {
        // get sets the default value if key is not found
        console.log("GET:", key, default_value);
        const val = this._get(key);
        console.log("FOUND:", val);
        if (val === undefined) {
            this.set(key, default_value);
            return default_value;
        } else {
            console.log("NOT UNDEFINED:", val);
            return this.capabilities.typed ? val : this.decode(val);
        }
    }
    set(key, value) { 
        console.log("SETTING:", key, value);
        this._set(key, this.capabilities.typed ? value : this.encode(value)); 
        return this; 
    }
    del(key) { this._del(key); return this; }
    all() {
        const res = {};
        const _all = this._all();
        Object.entries(_all).forEach(([k, v]) => res[k] = (this.capabilities.typed ? v : this.decode(v)));
        return res;
    }
    keys() { return Object.keys(this._all()); }
    values() { return Object.values(this._all()).map(v => (this.capabilities.typed ? v : this.encode(v))); }
    entries() { return Object.entries(this._all()).map(([k,v]) => [k, (this.capabilities.typed ? v : this.encode(v))]); }
    clear() { this.keys().forEach(k => this.del(k)); }

    // you must override these
    _get(key) { return undefined; }
    _set(key, value) {}
    _del(key) {}
    _all() { return {}; }
    save(vals) {}
    includes(key) { return false; }
}
