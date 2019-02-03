
import $ from 'jquery';

const dkconsole = require('../dkboot/dk-console.js');
const _p = require('./dk-publish.js');


const state = {};


const _url2name = function (url) {
    return url.split('/').slice(-1)[0];
};

/**
 * load script tags to state
 */
$('head>script[src]').each(function () {
    const src = $(this).attr('src');
    state[_url2name(src)] = {
        type: 'js',
        url: src,
        loaded: true,
        item: this
    };
});


/**
 * Load stylesheets (.css) to state
 */
$('head>link[rel=stylesheet]').each(function () {
    const url = $(this).attr('href');
    state[_url2name(url)] = {
        type: 'css',
        url: url,
        loaded: true,
        item: this
    };
});


const load_javascript = function (name, url, fn) {
    return $.ajax({
        dataType: "script",
        cache: true,
        url: url,
        success: function () {
            state[name].loaded = true;
            _p.publish(state[name], 'loaded', url);
            if (fn) fn();
        }
    });
};
load_javascript.type = 'js';


const load_css = function (name, url, fn) {
    $('<link>', {
        rel: "stylesheet",
        type: 'text/css',
        href: url
    }).appendTo('head');
    state[name].loaded = true;
    _p.publish(state[name], 'loaded', url);
    if (fn) fn();
};
load_css.type = 'css';


const load_url = function (loader, url, fn) {
    const name = _url2name(url);
    const loadstate = state[name];
    if (!loadstate) {
        state[name] = {
            type: loader.type,
            url: url,
            loaded: false
        };
        dkconsole.info("require:", url);
        loader(name, url, fn);
    } else if (fn) {
        if (loadstate.loaded) {
            fn();
        } else {
            _p.on(loadstate, 'loaded').run(fn);
        }
    }
};


const load_all = function load_all (loader, urls, fn) {
    if (Array.isArray(urls)) {
        if (urls.length === 1) {
            return load_url(loader, urls[0], fn);
        } else {
            return load_url(loader, urls[0], function () {
                load_all(loader, urls.slice(1), fn);
            });
        }
    } else {
        return load_url(loader, urls, fn);
    }
};


export default {
    _loadstate: state,

    css: function (url, fn) {
        return load_all(load_css, url, fn);
    },

    js: function (url, fn) {
        return load_all(load_javascript, url, fn);
    }
};
