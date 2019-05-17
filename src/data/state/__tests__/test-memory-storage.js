import {MemoryStorage} from "../storage-engines";


test("test-memory-storage", () => {
    const s = new MemoryStorage();
    s.set('foo', 42);
    s.set('bar.q', {foo:42});
    
    expect(s.get('foo')).toEqual(42);
    expect(s.get('bar.q')).toEqual({foo:42});
    
    expect(s.store.foo).toEqual(42);
    expect(s.store['bar.q']).toEqual({foo:42});
    
    s.store.foo = 43;
    s.store['bar.q'] = {foo: 43};
    
    console.log(s._db);
    console.log(s.count);
    
    expect(s.get('foo')).toEqual(43);
    expect(s.get('bar.q')).toEqual({foo:43});

    expect(s.store.foo).toEqual(43);
    expect(s.store['bar.q']).toEqual({foo:43});

    expect(1).toBe(0);
});
