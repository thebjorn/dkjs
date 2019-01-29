/* eslint-disable no-console */

import dkglobal from "../dkglobal";

export const loglevels = {
    ERROR: 0,
    WARN: 1,
    LOG: 2,
    INFO: 3,
    DEBUG: 4
};


export const env = {
    _loglevel: null,
    _debug: null,
    _attrs: null,
    
    _get_attrs() {
        const tag = dkglobal._dk_script_tag;

        const _attrs = {  // defaults
            crossorigin: null,
            main: null
        };

        Array.from(tag.attributes, attr => {
            let val;
            switch (attr.name.toLowerCase()) {
                case 'debug': break;
                case 'loglevel': break;
                case 'crossorigin':
                    _attrs.crossorigin = attr.value;
                    break;
                case 'data-main':
                    val = attr.value;
                    if (val.slice(-val.length) !== '.js') {
                        val += '.js';
                    }
                    _attrs[attr.name] = val;
                    break;
                default:
                    // console.debug("default:attr.name", attr.name, "attr.value", attr.value);
                    _attrs[attr.name] = attr.value;
                    break;
            }
        });
        return _attrs;
    },
    
    _get_loglevel() {
        if (dkglobal.LOGLEVEL !== undefined) return dkglobal.LOGLEVEL;
        if (dkglobal.DEBUG !== undefined) {
            this._debug = dkglobal.DEBUG;
            return loglevels.DEBUG;
        }

        const tag = dkglobal._dk_script_tag;
        if (tag === null) return loglevels.DEBUG;  // running under e.g. jest
        const tag_loglevel = tag.getAttribute('loglevel');
        if (tag_loglevel !== null) return parseInt(tag_loglevel, 10);

        const tag_debug = tag.getAttribute('debug');
        if (tag_debug !== null) {
            this._debug = !!tag_debug;
            return loglevels.DEBUG;  // level == 4
        }

        return loglevels.ERROR;  // level == 0
    },
    
    _get_debug() {
        if (dkglobal.DEBUG !== undefined) return dkglobal.DEBUG;
        const tag = dkglobal._dk_script_tag;
        if (tag === null) return true;   // running under e.g. jest
        const tag_debug = tag.getAttribute('debug');
        if (tag_debug !== null) return !!tag_debug;
        return false;
    },
    
    get attrs() {
        if (this._attrs === null) this._attrs = this._get_attrs();
        return this._attrs;
    },
    
    get LOGLEVEL() {
        if (this._loglevel === null) this._loglevel = this._get_loglevel();           
        return this._loglevel;
    },

    get DEBUG() {
        if (this._debug === null) this._debug = this._get_debug();
        return this._debug;
    }
};
