// import and attach LVL:0-1 modules

import performance from "./performance-timer";
import {env} from "./lifecycle/dkboot/lifecycle-parse-script-tag";
import * as text from "./core/text-utils";
import counter from "./core/counter";
import * as dom from "./browser/dom";
import {shallow_observer, deep_observer} from "./data/observable";
import require_css from "./browser/loaders";
import dkglobal from "./lifecycle/dkglobal";
import Class from "./lifecycle/coldboot/dk-class";
import version from "./version";
import create_debug_environment from "./lifecycle/dkboot/lifecycle-create-debug-environment";
import namespace from "./lifecycle/coldboot/dk-namespace";
import setup_signals from "./lifecycle/dkboot/dk-signals";
import setup_loaders from "./lifecycle/lifecycle-setup-loaders";
import {dkconsole} from "./lifecycle/dkboot/dk-console";


const dk = function dk(selector) {
    return document.querySelector(selector);
};

Object.assign(dk, {
    Class,
    counter,
    globals: dkglobal,
    env,
    namespace,
    dom,
    ...dkconsole,
    node: dom.create_dom,
    
    shallow_observer,
    deep_observer,
    
    performance,
    require: {
        css: require_css
    },
    version,
    text,
    id2name: text.id2name,
    cls2id: text.cls2id,
    count: text.count_char,
    dedent: text.dedent,
    
    // externals
    _,
    $: jQuery,
    _jquery_version: jQuery.fn.jquery,
    _lodash_version: _.VERSION,

    // locally defined
    all(selector) {
        return document.querySelectorAll(selector);
    },
    
    app: {
        state: {}
    }
});

dk.DEBUG = env.DEBUG;
dk.LOGLEVEL = env.LOGLEVEL;

dk.dkjstag = {
    get src() {
        dkconsole.warn("dk.dkjstag.src is deprecated, use dk.scripttag_attributes.src");
        return env.attrs.src;
    },
    get loglevel() {
        dkconsole.warn("dk.dkjstag.loglevel is deprecated, use dk.LOGLEVEL");
        return env.LOGLEVEL;
    },
    get debug() {
        dkconsole.warn("dk.dkjstag.debug is deprecated, use dk.DEBUG");
        return env.DEBUG;
    },
    get main() {
        dkconsole.warn("dk.dkjstag.main is deprecated, use dk.scripttag['data-main']");
        return env.attrs['data-main'];
    },
    get tag() {
        dkconsole.warn("dk.dkjstag.tag is deprecated and shouldn't be used anymore.");
        return env.null;  // XXX: dk.$(tag) ?
    }
};

// dk_script_tag(dk);
create_debug_environment(dk);
// setup_console(dk);
setup_signals(dk, dk.DEBUG ? dk.ERROR : dk.INFO);
setup_loaders(dk);

performance('created-dk-obj');
export default dk;
