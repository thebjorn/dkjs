/* global: expect */

import {State} from '../dk-state';
import {CookieStorage, HashStorage, LocalStorage, SessionStorage} from "../storage-engines";
const engines = {
    CookieStorage,
    LocalStorage,
    SessionStorage,
    HashStorage
};


test("HashStorage.encode", () => {
    console.info("HashStorage.encode");
    const h = new HashStorage();
    expect(h.encode(42)).toBe('42');
    expect(h.encode('fourtwo')).toBe('"fourtwo"');
    expect(h.encode([])).toBe('[]');
    expect(h.encode({})).toBe('{}');
    expect(h.encode({a:42})).toBe('{"a":42}');
    expect(h.encode([1, 2])).toBe('[1,2]');
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


test("State.save|restore", () => {
    console.info("State.save|restore");
    Object.entries(engines).forEach(([name, engine]) => {
        const state = new State({engine: engine, name: 's2'});
        // console.info('engine', engine.name, state.changed(), state._laststate, state.state);
        state.save();
        state.set_item('hello', 'world');
        expect(state.get_item('hello')).toBe('world');
        // console.info('engine', state.changed(), state._laststate, state.state);
        expect(state.changed()).toBe(true);
        state.restore();
        // console.info("STATE:", state.state, typeof state.state);
        // expect(state.get_item('hello', 'NOTFOUND')).toBe('"world"');
    });
});
