
import {decode_url_value, encode_url_value} from "./serializers";
import {StorageBase} from "./storage";


export class HashStorage extends StorageBase {
    constructor() {
        super();
        this.name = 'HashStorage';
        this.capabilities = {
            flat: true,
            typed: false,
            write_all: true,
            max_keys: null,
            max_total_size: 2050,  // Edge, others are 50K+
            max_value_size: null,
        };
    }
    
    _get(key) { return this._all()[key]; }
    
    _set(key, val) {
        const vals = this._all();
        vals[key] = val;
        this.save(vals);
    }
    
    _del(key) {
        const vals = this._all();
        delete vals[key];
        this.save(vals);
    }
    
    _all() {
        const hash_fragment = document.location.hash.substring(1);
        if (hash_fragment === "") return {};
        return decode_url_value(hash_fragment);
    }
    
    save(vals) {
        document.location.hash = encode_url_value(vals);
    }
    
    includes(key) {
        const vals = this._all();
        return key in vals;
    }

}
