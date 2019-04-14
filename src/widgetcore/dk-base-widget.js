import Class from "../lifecycle/coldboot/dk-class";
import counter from "../core/counter";
import {cls2id} from "../text/text-utils";
// import is from "../is";
import {dkwarning} from "../lifecycle/coldboot/dkwarning";
import dk from "../dk-obj";


export class BaseWidget extends Class {
    constructor(...args) {
        super(...args);
        if (this.type === undefined) this.type = this.constructor.name;
    }

    isEqual(other) {
        return this === other;
    }

    /*
     *  Get the widget state.
     *  Called by browser/dk-state:State.save_widget(w) to save the widget
     *  state to a storage engine (cookies, hash-storage, localstorage, etc.)
     *  This method should return a dict.
     */
    // noinspection JSMethodCanBeStatic
    get state() {
        return {};
    }

    /**
     * Set the widget state.
     * Called by browser/dk-state:State.restore_widget(w) to restore the
     * widget to a prior state that has been saved/serialized to a storage
     * engine (cookies, hash-storage, localstorage, etc.) 
     * ``val`` is a dict, as returned by this.get state, but likely with
     * the values converted to strings.
     * @param val
     */
    set state(val) {
        // default implementation does nothing
    }
    
    // on/trigger is more standard names for notify/publish/subscribe
    on(evtname, fn) {
        dk.on(this, evtname, fn);
    }

    trigger(evntname, ...args) {
        dk.trigger(this, evntname, ...args);
    }

    notify(trigname, ...args) {
        dkwarning(`Widget.notify is deprecated, use Widget.trigger ${this}`);
        dk.trigger(this, trigname, ...args);
    }

    static next_widget_id() {
        return counter(cls2id(this.name) + '-');
    }
}


