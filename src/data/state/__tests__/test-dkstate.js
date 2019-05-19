/* global: expect */

import {State} from '../dk-state';
import {decode_url_value, encode_url_value} from "../serializers";
import {CookieStorage} from "../cookie-storage";
import {LocalStorage} from "../local-storage";
import {SessionStorage} from "../session-storage";
import {HashStorage} from "../hash-storage";
const engines = {
    CookieStorage,
    LocalStorage,
    SessionStorage,
    HashStorage
};


test("encode_url_value", () => {
    // console.info("encode_url_value");
    const vals = [
        42,
        'fourtwo',
        [],
        {},
        {a:42},
        [1,2]
    ];
    // console.log(encode_url_value({a:42}));
    vals.forEach(v => {
        expect(decode_url_value(encode_url_value(v))).toEqual(v);
    });
});


test("State.get|set_item", () => {
    
    Object.entries(engines).forEach(([name, engine]) => {
        console.info("State.get|set_item", name);
        
        const state = new engine;

        const val = state.get('hello', 'world');
        expect(val).toBe('world');
        expect(state.all()).toMatchObject({"hello": "world"});
        
        state.set('my-widget-1', 'world');
        expect(state.get('my-widget-1', 'hello')).toBe('world');
    });
});


// test("State.changed", () => {
//     // state should always be changed() == false from the outside.
//     console.info("State.changed");
//     Object.entries(engines).forEach(([name, engine]) => {
//         const state = new State({engine: engine, name: 's1'});
//        
//         expect(state._values).toBe(null);
//         expect(state._engine_state).toBe("null");
//         expect(state.changed()).toBe(false);
//         expect(state.engine.values).toMatchObject({});
//
//         const val = state.get_item('my-widget-1', 'hello', 'world');
//         expect(state.changed()).toBe(false);
//         expect(state.engine.values).toMatchObject({"my-widget-1": {"hello": "world"}});
//         // expect(document.cookie).toBe('')
//     });
// });
