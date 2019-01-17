import {array_intersection, set_empty} from "../set-ops";


export default function create_debug_environment(dk) {
    dk.keys = () => Object.keys(dk).sort();
    
    if (dk.DEBUG) {
        dk.add = function (attrs) {
            let common = array_intersection(dk.keys(), Object.keys(attrs));
            if (!set_empty(common)) {
                throw `ERROR: trying to add existing property: ${[...common]}`;
            }
            Object.assign(dk, attrs);
        };
    } else {
        dk.add = attrs => Object.assign(dk, attrs);
    }
}
