import {StorageBase} from "../storage";
import {MemoryStorage} from "../memory-storage";
import {HashStorage} from "../hash-storage";
import {LocalStorage} from "../local-storage";
import {SessionStorage} from "../session-storage";
import {CookieStorage} from "../cookie-storage";


// test("test-storage-base", () => {
//     const s = new StorageBase();
//    
//     expect(s.get('foo', 'bar')).toEqual('bar');
//     s.set('baz', 42);
//     expect(s.get('baz', 'bar')).toEqual(42);
//
//     expect(s.all()).toEqual({foo: 'bar', baz: 42});
//     s.del('foo');
//     expect(s.all()).toEqual({baz: 42});
//     expect(s.includes('baz')).toBeTruthy();
//     expect(s.keys()).toEqual(['baz']);
//     expect(s.entries()).toEqual([['baz', 42]]);
//     s.clear();
//     expect(s.all()).toEqual({});
// });


test("test-memory-storage", () => {
    const s = new MemoryStorage();

    expect(s.get('foo', 'bar')).toEqual('bar');
    s.set('baz', 42);
    expect(s.get('baz', 'bar')).toEqual(42);

    expect(s.all()).toEqual({foo: 'bar', baz: 42});
    s.del('foo');
    expect(s.all()).toEqual({baz: 42});
    expect(s.includes('baz')).toBeTruthy();
    expect(s.keys()).toEqual(['baz']);
    expect(s.values()).toEqual([42]);
    expect(s.entries()).toEqual([['baz', 42]]);
    s.clear();
    expect(s.all()).toEqual({});
});



test("test-hash-storage", () => {
    const s = new HashStorage();

    expect(s.get('foo', 'bar')).toEqual('bar');
    s.set('baz', 42);
    expect(s.get('baz', 'bar')).toEqual(42);

    expect(s.all()).toEqual({foo: 'bar', baz: 42});
    s.del('foo');
    expect(s.all()).toEqual({baz: 42});
    expect(s.includes('baz')).toBeTruthy();
    expect(s.keys()).toEqual(['baz']);
    expect(s.values()).toEqual([42]);
    expect(s.entries()).toEqual([['baz', 42]]);
    s.clear();
    expect(s.all()).toEqual({});
});


test("test-local-storage", () => {
    const s = new LocalStorage();

    expect(s.get('foo', 'bar')).toEqual('bar');
    s.set('baz', 42);
    expect(s.get('baz', 'bar')).toEqual(42);

    expect(s.all()).toEqual({foo: 'bar', baz: 42});
    s.del('foo');
    expect(s.all()).toEqual({baz: 42});
    expect(s.includes('baz')).toBeTruthy();
    expect(s.keys()).toEqual(['baz']);
    expect(s.values()).toEqual([42]);
    expect(s.entries()).toEqual([['baz', 42]]);
    s.clear();
    expect(s.all()).toEqual({});
});



test("test-session-storage", () => {
    const s = new SessionStorage();

    expect(s.get('foo', 'bar')).toEqual('bar');
    s.set('baz', 42);
    expect(s.get('baz', 'bar')).toEqual(42);

    expect(s.all()).toEqual({foo: 'bar', baz: 42});
    s.del('foo');
    expect(s.all()).toEqual({baz: 42});
    expect(s.includes('baz')).toBeTruthy();
    expect(s.keys()).toEqual(['baz']);
    expect(s.values()).toEqual([42]);
    expect(s.entries()).toEqual([['baz', 42]]);
    s.clear();
    expect(s.all()).toEqual({});
});



test("test-cookie-storage", () => {
    const s = new CookieStorage();

    expect(s.get('foo', 'bar')).toEqual('bar');
    s.set('baz', 42);
    expect(s.get('baz', 'bar')).toEqual(42);

    expect(s.all()).toEqual({foo: 'bar', baz: 42});
    s.del('foo');
    console.log(document.cookie);
    expect(s.all()).toEqual({baz: 42});
    expect(s.includes('baz')).toBeTruthy();
    expect(s.keys()).toEqual(['baz']);
    expect(s.values()).toEqual([42]);
    expect(s.entries()).toEqual([['baz', 42]]);
    console.log(document.cookie);
    s.clear();
    console.log(document.cookie);
    expect(s.all()).toEqual({});
});
