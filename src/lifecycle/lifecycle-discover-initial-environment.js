import dkglobal from "./dkglobal";
import {parse_src} from "./uri";


/**
 * Store global object and all script/link tag sources.
 *
 * @param dk
 * @param attrs
 */
export default function discover_initial_environment(dk, attrs) {
    dk.performance('discover-initial-environment-start');
    dk.app = {state: {}};
    dk.webpage = {scripts: {}, stylesheets: {}};
    dk.globals = dkglobal;
    
    function save_url(uri, kind, tag) {
        if (/polyfill\.io/.test(uri)) return;
        let url_info = parse_src(uri);
        url_info.tag = tag;
        let db = dk.webpage[kind];
        if (url_info.libname in db) {
            throw `Script included multiple times:
                ${url_info.source}
                ${dk.webpage[kind][url_info.libname].source}
            `;
        }
        dk.webpage[kind][url_info.libname] = url_info;
    }
    
    Array.from(document.scripts, script => save_url(script.getAttribute('src'), 'scripts', script));
    const style_links = document.querySelectorAll('link[href][rel=stylesheet]');
    Array.from(style_links)
         .forEach(lnk => save_url(lnk.getAttribute('href'), 'stylesheets', lnk));
    
    dk.performance('discover-initial-environment-end');
}
