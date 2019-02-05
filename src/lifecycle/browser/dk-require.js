
import dk from "../../dk-obj";
// import {dkconsole} from "../dkboot/dk-console";
import {parse_src} from "../uri";

export const state = {};
let _loaded_page_tags = false;


class _dkrequire {
    constructor(url) {
        this.src = parse_src(url);
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
        $('<link>', {
            rel: "stylesheet",
            type: 'text/css',
            href: url
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
                const src = parse_src(src_url);
                state[src.libname] = {
                    src,
                    loaded: true
                };
            });
            _loaded_page_tags = true;
        }
    }

}

export function dkrequire(url, callback) {
    _dkrequire.find_header_impports();
    const r = new _dkrequire(url);
    return r.load(callback);
}


export function dkrequire_urls(urls) {
    _dkrequire.find_header_impports();
    const reqs = urls.map(url => new _dkrequire(url));
    return reqs.map(r => r.load());
}
