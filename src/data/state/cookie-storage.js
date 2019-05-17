import {decode_url_value, encode_url_value} from "./serializers";
import cookie from "../../browser/dk-cookie";
import {StorageBase} from "./storage";

export class CookieStorage extends StorageBase{
    constructor() {
        super();
        this.name = 'CookieStorage';
        this.capabilities = {
            flat: true,
            typed: false,
            write_all: false,
            max_keys: 150,
            max_total_size: 10234,
            max_value_size: 4093,
        };
    }
    
    _get(key) { 
        const val = cookie.get(key, {raw:true});
        return val === null ? undefined : val;
    }

    _set(key, val) {
        cookie.set(key, val, {
            expires: "Tue, 19 Jan 2038 03:14:07 GMT", 
            path: "/", 
            raw: true
        });
    }

    _del(key) { cookie.remove(key); }
    
    _all() { return cookie.all(); }
    includes(key) { return cookie.includes(key); }
    keys() { return cookie.keys(); }
    entries() { return cookie.entries(); }
}
