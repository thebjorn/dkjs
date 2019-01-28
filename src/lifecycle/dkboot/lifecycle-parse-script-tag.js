/* eslint-disable no-console */

import dkglobal from "../dkglobal";

export const loglevels = {
    ERROR: 0,
    WARN: 1,
    LOG: 2,
    INFO: 3,
    DEBUG: 4
};


function find_dk_script_tag() {
    // all but IE
    if (document.currentScript !== undefined) return document.currentScript;
    // ..for IE (get the last executed script -- oh, so hackish, but the alternatives are worse)
    const scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
}

export const env = {
    _loglevel: null,
    _debug: null,
    _attrs: null,
    
    _get_attrs() {
        const tag = find_dk_script_tag();

        this._attrs = {  // defaults
            crossorigin: null,
            main: null
        };

        Array.from(tag.attributes, attr => {
            let val;
            switch (attr.name.toLowerCase()) {
                case 'debug': break;
                case 'loglevel': break;
                case 'crossorigin':
                    this._attrs.crossorigin = attr.value;
                    break;
                case 'data-main':
                    val = attr.value;
                    if (val.slice(-val.length) !== '.js') {
                        val += '.js';
                    }
                    this._attrs[attr.name] = val;
                    break;
                default:
                    this._attrs[attr.name] = attr.value;
                    break;
            }
        });
    },
    
    _get_loglevel() {
        if (dkglobal.LOGLEVEL !== undefined) return dkglobal.LOGLEVEL;
        if (dkglobal.DEBUG !== undefined) {
            this._debug = dkglobal.DEBUG;
            return loglevels.DEBUG;
        }

        const tag = find_dk_script_tag();
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
        const tag = find_dk_script_tag();
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
