
import globalThis from "../lifecycle/dkglobal";
import dk from "../dk-obj";

if (typeof window === "undefined") {
    // running under node.js
    globalThis.window = {
        navigator: {
            userAgent: ''
        }
    };
}


export default (function () {
    // $.browser disappeared in jQuery 1.9
    if (dk.$.browser) return dk.$.browser;
    if (globalThis._browser) return this._browser;

    // from jquery.dynatree.js with modifications
    let matched, browser;

    const uaMatch = function(ua) {
        ua = ua.toLowerCase();

        const match = /(opr)[/]([\w.]+)/.exec(ua) ||
            /(edge)[/]([\w.]+)/.exec(ua) ||
            /(chrome)[ /]([\w.]+)/.exec(ua) ||
            /(version)[ /]([\w.]+).*(safari)[ /]([\w.]+)/.exec(ua) ||
            /(webkit)[ /]([\w.]+)/.exec(ua) ||
            /(opera)(?:.*version|)[ /]([\w.]+)/.exec(ua) ||
            /(msie) ([\w.]+)/.exec(ua) ||
            ua.indexOf("trident") >= 0 && /(rv)(?:[: ])([\w.]+)/.exec(ua) ||
            ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
            [];

        const platform_match = /(ipad)/.exec(ua) ||
                /(iphone)/.exec(ua) ||
                /(android)/.exec(ua) ||
                /(windows phone)/.exec(ua) ||
                /(win)/.exec(ua) ||
                /(mac)/.exec(ua) ||
                /(linux)/.exec(ua) ||
                [];

        return {
            browser: match[ 3 ] || match[ 1 ] || "",
            version: match[ 2 ] || "0",
            platform: platform_match[0] || ""
        };
    };
    matched = uaMatch(window.navigator.userAgent);
    browser = {};
    if (matched.browser) {
        browser[matched.browser] = true;
        browser.version = matched.version;
        browser.versionNumber = parseInt(matched.version, 10);
    }
    if (matched.platform) browser[matched.platform] = true;
    if (browser.chrome || browser.opr || browser.safari) browser.webkit = true;
    if (browser.rv) {
        matched.browser = 'msie';
        browser.msie = true;
    }
    if (browser.opr) {
        matched.browser = 'opera';
        browser.opera = true;
    }
    if (browser.safari && browser.android) {
        matched.browser = 'android';
        browser.android = true;
    }
    browser.name = matched.browser;
    browser.platform = matched.platform;
    return browser;
}());
