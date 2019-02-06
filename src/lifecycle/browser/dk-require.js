
import dk from "../../dk-obj";
// import {dkconsole} from "../dkboot/dk-console";
import {parse_src} from "../uri";
import {dkconsole} from "../dkboot/dk-console";
import {dedent} from "../../core/text-utils";

export const state = {};
let _loaded_page_tags = false;


class _dkrequire {
    constructor(url, filetype) {
        const m = url.match(/^\[fetch:(css|js)]/);
        
        if (m) {
            filetype = '.' + m[1];
            url = url.slice(m[0].length);
        } 
        this.src = parse_src(url);
        if (!m && filetype) {
            this.src.filetype = filetype;
        }
    }
    
    get loaded() {
        return state[this.src.libname];
    }
    
    load(callback) {
        if (this._begin_reguire()) {
            const loadstate = state[this.src.libname];
            
            switch (this.src.filetype) {
                case '.js':
                    this._load_javascript(callback);
                    break;
                case '.css':
                    this._load_css(callback);
                    break;
                default:
                    dkconsole.error(dedent(`
                    dkrequire couldn't automatically deduce the type of 
                    
                        ${this.src.source}
                        
                    please use dkrequire_css or dkrequire_js to load this url,
                    or prefix the url with [fetch:css] or [fetch:js].
                    `));
            }
            
            if (callback) {
                if (loadstate.loaded) {
                    callback(this.src);
                } else {
                    dk.on(this.src, 'loaded', callback);
                }
            }
        }
        return this.src;
    }

    _begin_reguire() {
        if (state[this.src.libname]) return false;  // don't start loading again
        state[this.src.libname] = {
            src: this.src,
            loaded: false
        };
        return true;
    }

    _load_javascript() {
        const self = this;
        return dk.$.ajax({
            dataType: "script",
            cache: true,
            url: self.src.source,
            success: function () {
                state[self.src.libname].loaded = true;
                dk.trigger(self.src, 'loaded', self.src);
            }
        });
    }

    _load_css() {
        const self = this;
        dk.$('<link>', {
            rel: "stylesheet",
            type: 'text/css',
            href: self.src.source
        }).appendTo('head');
        state[this.src.libname].loaded = true;
        dk.trigger(this.src, 'loaded', this.src);
    }
    
    static find_header_impports() {
        if (!_loaded_page_tags) {
            /**
             * load script tags to state
             */
            dk.$('head>script[src]').each(function () {
                const src_url = dk.$(this).attr('src');
                const src = parse_src(src_url);
                state[src.libname] = {
                    src,
                    loaded: true
                };
            });

            /**
             * Load stylesheets (.css) to state
             */
            dk.$('head>link[rel=stylesheet]').each(function () {
                const url = dk.$(this).attr('href');
                const src = parse_src(url);
                state[src.libname] = {
                    src,
                    loaded: true
                };
            });
            _loaded_page_tags = true;
        }
    }

}

export function dkrequire_loaded(url) {
    _dkrequire.find_header_impports();
    const r = new _dkrequire(url);
    return r.loaded;
}

export function dkrequire_css(url, callback) {
    return dkrequire(url, callback, '.css');
}


export function dkrequire_js(url, callback) {
    return dkrequire(url, callback, '.js');
}


export function dkrequire(url, callback, filetype) {
    _dkrequire.find_header_impports();
    const r = new _dkrequire(url, filetype);
    return r.load(callback);
}


export function dkrequire_urls(urls) {
    _dkrequire.find_header_impports();
    const reqs = urls.map(url => new _dkrequire(url));
    return reqs.map(r => r.load());
}
