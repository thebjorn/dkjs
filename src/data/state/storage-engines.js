/**
 * Storage implementations should follow the following semantics
 * 
 * (i.e. the following class is most likely only useful as documentation)
 */
import {StorageBase} from "./storage";

export class MemoryStorage extends StorageBase {
    constructor() {
        super();
        this._data = {};
        this.capabilities = {
            flat: false,            // is the key namespace flat (must emulate foo.bar syntax)
            typed: true,            // are the values stored as strings (false)
            write_all: false,       // if true then the entire state must be saved to store every value
            max_keys: null,         // number of items we can store
            max_total_size: null,   // max size of all keys + values
            max_value_size: null,   // max size of an individual value
        };
        const self = this;
        const handler = {
            get(target, name) {
                return target[name];
            },
            set(obj, prop, value) {
                return Reflect.set(...arguments);
            }
        };
        this.store = new Proxy(this._data, handler);
    }
    _get(key) { return this._data[key]; }
    _set(key, value) {this._data[key] = value;}
    _del(key) {delete this._data[key];}
    all() { return this._data; }
    includes(key) {return key in self._data;}
    
    
}
