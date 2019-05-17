import {StorageBase} from "./storage";
import {base64_serializer} from "./serializers";
import cookie from "../../browser/dk-cookie";


export class LocalStorage extends StorageBase {
    constructor(engine) {
        super();
        this.name = 'LocalStorage';
        this.name_prefix = 'dks-';
        this.engine = engine || window.localStorage;
        this.serializer = base64_serializer;

        this.capabilities = {
            flat: true,
            typed: false,
            write_all: false,
            max_keys: null,
            max_total_size: 10485760,
            max_value_size: 10485760,
        };
    }
    
    _get(key) {
        const val = this.engine.getItem(key);
        return val === null ? undefined : val;
    }
    _set(key, val) { this.engine.setItem(key, val); }
    _del(key) { this.engine.removeItem(key); }
    _all() {
        const res = {};
        this.keys().forEach(k => res[k] = this.engine.getItem(k));
        return res;
    }
    
    keys() {
        const res = [];
        for (let i=0; i<this.engine.length; i++) {
            res.push(this.engine.key(i));
        }
        return res;
    }
    clear() { this.engine.clear(); }

    includes(key) { return this.keys().includes(key); }
}
