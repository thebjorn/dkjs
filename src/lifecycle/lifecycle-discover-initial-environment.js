import dkglobal from "./dkglobal";
import {parse_src} from "./uri";
// import define_lazy_value from "./define-lazy-value";


/**
 * Store global object and all script/link tag sources.
 *
 * @param dk
 * @param attrs
 */
export default function discover_initial_environment(dk, attrs) {
    dk.performance('discover-initial-environment-start');
    // dk.app = {state: {}};
    dk.webpage = {scripts: {}, stylesheets: {}};
    // dk.globals = dkglobal;
    
    function save_url(node, uri, obj, field) {
        if (/polyfill\.io/.test(uri)) return;
        let url_info = parse_src(uri);
        url_info.tag = node;
        let db = obj[field];        // infinite recursion?
        if (url_info.libname in db) {
            throw `Script included multiple times:
                ${url_info.source}
                ${db[url_info.libname].source}
            `;
        }
        db[url_info.libname] = url_info;
    }
    
    function save_from_nodes(nodes, attr, obj, field) {
        let anodes = Array.from(nodes);
        anodes.forEach(n => {
            let uri = n.getAttribute(attr);
            save_url(n, uri, obj, field);
            
        });
    }
    save_from_nodes(
        document.scripts,
        'src',
        dk.webpage, 'scripts'
    );
    save_from_nodes(
        document.querySelectorAll('link[href][rel=stylesheet]'),
        'href',
        dk.webpage, 'stylesheets'
    );
    
    // define_lazy_value(
    //     dk.webpage,
    //     'scripts',
    //     () => save_from_nodes(document.scripts, 'src', dk.webpage, 'scripts'),
    //     false
    // );
    // define_lazy_value(
    //     dk.webpage,
    //     'stylesheets',
    //     () => save_from_nodes(
    //         document.querySelectorAll('link[href][rel=stylesheet]'),
    //         'href',
    //         dk.webpage, 'stylesheets'
    //     ),
    //     false       // writable
    // );
    

    
    dk.performance('discover-initial-environment-end');
}
