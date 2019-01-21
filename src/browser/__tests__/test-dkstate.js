
import {CookieStorage, LocalStorage, SessionStorage, HashStorage, State} from '../dk-state';
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
    console.info("State.get|set_item");
    Object.entries(engines).forEach(([name, engine]) => {
        const state = new State(new engine(), 's0');

        // console.info('engine', engine.name, typeof state.state, state.state.toString());

        const val = state.get_item('hello', 'world');
        expect(val).toBe('world');
        expect(state.state['hello']).toBe('world');
        
        // state.set_item('hello', 'world');
        // expect(state.get_item('hello')).toBe('world');
        //
        // expect(state.get_item('hello', 'NOTFOUND')).toBe('NOTFOUND');
    });
});


test("State.changed", () => {
    console.info("State.changed");
    Object.entries(engines).forEach(([name, engine]) => {
        const state = new State(new engine(), 's0');

        // console.info('engine', engine.name, typeof state.state, state.state.toString());

        const val = state.get_item('hello', 'world');
        expect(val).toBe('world');
        expect(state.state['hello']).toBe('world');
        
        // state.set_item('hello', 'world');
        // expect(state.get_item('hello')).toBe('world');
        //
        // expect(state.get_item('hello', 'NOTFOUND')).toBe('NOTFOUND');
    });
});


test("State.save|restore", () => {
    console.info("State.save|restore");
    Object.entries(engines).forEach(([name, engine]) => {
        const state = new State(new engine(), 's0');
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
