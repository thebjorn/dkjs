/* global: expect */

import {State} from '../dk-state';
import {CookieStorage, HashStorage, LocalStorage, SessionStorage, encode_url_value, decode_url_value} from "../storage-engines";
const engines = {
    CookieStorage,
    LocalStorage,
    SessionStorage,
    HashStorage
};


test("encode_url_value", () => {
    console.info("encode_url_value");
    expect(encode_url_value(42)).toBe('42');
    expect(encode_url_value('fourtwo')).toBe('%22fourtwo%22');
    expect(encode_url_value([])).toBe('%5B%5D');
    expect(encode_url_value({})).toBe('%7B%7D');
    expect(encode_url_value({a:42})).toBe("%7B%22a%22%3A42%7D");
    expect(encode_url_value([1, 2])).toBe('%5B1%2C2%5D');
});


test("State.get|set_item", () => {
    
    Object.entries(engines).forEach(([name, engine]) => {
        console.info("State.get|set_item", name);
        const state = new State({engine: engine, name: 's0'});

        const val = state.get_item('my-widget-1', 'hello', 'world');
        expect(val).toBe('world');
        expect(state._values).toMatchObject({"my-widget-1": {"hello": "world"}});
        // expect(document.location.hash).toBe("#%7B%22my-widget-1%22%3A%7B%22hello%22%3A%22world%22%7D%7D");
        
        state.set_item('my-widget-1', 'hello', 'world');
        expect(state.get_item('my-widget-1', 'hello')).toBe('world');

        expect(state.get_item('my-widget-1', 'hello', 'NOTFOUND')).toBe('world');
    });
});


test("State.changed", () => {
    // state should always be changed() == false from the outside.
    console.info("State.changed");
    Object.entries(engines).forEach(([name, engine]) => {
        const state = new State({engine: engine, name: 's1'});
        
        expect(state._values).toBe(null);
        expect(state._engine_state).toBe("null");
        expect(state.changed()).toBe(false);
        expect(state.engine.values).toMatchObject({});

        const val = state.get_item('my-widget-1', 'hello', 'world');
        expect(state.changed()).toBe(false);
        expect(state.engine.values).toMatchObject({"my-widget-1": {"hello": "world"}});
        // expect(document.cookie).toBe('')
    });
});
