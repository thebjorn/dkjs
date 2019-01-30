// import and attach LVL:0-1 modules

// jest needs these, webpack craps from them..
import lodash from 'lodash';
import jQuery from 'jquery';


import performance from "./performance-timer";
import {env} from "./lifecycle/dkboot/lifecycle-parse-script-tag";
import * as text from "./core/text-utils";
import counter from "./core/counter";

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
import {dkwarning} from "./lifecycle/coldboot/dkwarning";


const dk = function dk(selector) {
    return document.querySelector(selector);
};

Object.assign(dk, {
    Class,
    counter,
    globals: dkglobal,
    env,
    namespace,

    ...dkconsole,

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
    _: lodash,
    $: jQuery,
    _jquery_version: jQuery.fn.jquery,
    _lodash_version: lodash.VERSION,

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
        dkwarning("dk.dkjstag.src is deprecated, use dk.scripttag_attributes.src");
        return env.attrs.src;
    },
    get loglevel() {
        dkwarning("dk.dkjstag.loglevel is deprecated, use dk.LOGLEVEL");
        return env.LOGLEVEL;
    },
    get debug() {
        dkwarning("dk.dkjstag.debug is deprecated, use dk.DEBUG");
        return env.DEBUG;
    },
    get main() {
        dkwarning("dk.dkjstag.main is deprecated, use dk.scripttag['data-main']");
        return env.attrs['data-main'];
    },
    get tag() {
        dkwarning("dk.dkjstag.tag is deprecated and shouldn't be used anymore.");
        return dkglobal._dk_script_tag;
    }
};

// dk_script_tag(dk);
create_debug_environment(dk);
// setup_console(dk);
setup_signals(dk, dk.DEBUG ? dk.ERROR : dk.INFO);
setup_loaders(dk);

performance('created-dk-obj');
export default dk;
