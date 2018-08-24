import {create_dom} from "./dom";

/**
 * Load (unconditionally) the css-uri.
 *
 * @param uri
 */
function require_css(uri) {
    let link = create_dom('link', {
        rel: "stylesheet",
        type: 'text/css',
        href: uri
    });
    if (typeof link === "undefined") throw "Failed to create link node";

    document.getElementsByTagName("head")[0].appendChild(link);
}
