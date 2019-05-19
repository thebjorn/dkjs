import {decode_url_value, encode_url_value} from "./serializers";


export class StorageBase {
    constructor() {
        this._encode = encode_url_value;
        this._decode = decode_url_value;
        
        this.capabilities = {
            flat: false,            // is the key namespace flat (must emulate foo.bar syntax)
            typed: true,            // are the values stored as strings (false)
            write_all: false,       // (x) if true then the entire state must be saved to store every value
            max_keys: null,         // number of items we can store
            max_total_size: null,   // max size of all keys + values
            max_value_size: null,   // max size of an individual value
        };

    }
    
    encode(v) {return this.capabilities.typed ? v : this._encode(v);}
    decode(v) {return this.capabilities.typed ? v : this._decode(v);}
    
    // default implementations (you can override these)
    get(key, default_value) {
        // get sets the default value if key is not found
        const val = this._get(key);
        if (val === undefined) {
            this.set(key, default_value);
            return default_value;
        } else {
            return this.decode(val);
        }
    }
    set(key, value) { 
        this._set(key, this.encode(value)); 
        return this; 
    }
    del(key) { this._del(key); return this; }
    all() {
        const res = {};
        const _all = this._all();
        Object.entries(_all).forEach(([k, v]) => res[k] = this.decode(v));
        return res;
    }
    keys() { return Object.keys(this._all()); }
    values() { return Object.values(this._all()).map(v => this.decode(v)); }
    entries() { return Object.entries(this._all()).map(([k,v]) => [k, this.decode(v)]); }
    clear() { this.keys().forEach(k => this.del(k)); }

    // you must override these
    _get(key) { return undefined; }
    _set(key, value) {}
    _del(key) {}
    _all() { return {}; }
    save(vals) {}
    includes(key) { return false; }
}
