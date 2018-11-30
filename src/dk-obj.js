// import and attach LVL:0 modules

import performance from "./performance-timer";
import dkglobal from "./lifecycle/dkglobal";
import Class from "./lifecycle/boot/dk-class";
import version from "./version";
import parse_script_tag from "./lifecycle/lifecycle-parse-script-tag";
import setup_console from "./lifecycle/browser/dk-console";
import create_debug_environment from "./lifecycle/lifecycle-create-debug-environment";
import namespace from "./lifecycle/boot/dk-namespace";
import setup_signals from "./lifecycle/boot/dk-signals";


const dk = function dk(selector) {
    return document.querySelector(selector);
};

Object.assign(dk, {
    version,
    performance,
    Class,
    namespace,
    globals: dkglobal,
    _,
    $: jQuery,
    _jquery_version: jQuery.fn.jquery,
    _lodash_version: _.VERSION,

    all(selector) {
        return document.querySelectorAll(selector);
    },
    
    app: {
        state: {}
    }
});

parse_script_tag(dk);
create_debug_environment(dk);
setup_console(dk);
setup_signals(dk, dk.DEBUG ? dk.ERROR : dk.INFO);

performance('created-dk-obj');
export default dk;
