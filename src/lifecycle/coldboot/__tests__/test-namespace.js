
import namespace from "../dk-namespace";

test("dk.namespace.create", () => {
    let root = {};
    
    namespace.create_namespace.call(root, 'a.b.c');
    expect(root.a.b.c).toEqual({});

    namespace.create_namespace.call(root, 'a.b.c.d');
    expect(root.a.b.c).toEqual({d: {}});

    namespace.create_namespace.call(root, 'a.b.c.d.e', 42);
    expect(root.a.b.c.d.e).toEqual(42);
});


test("dk.namespace.traverse", () => {
    let root = {};
    namespace.create_namespace.call(root, 'a.b.c.d.e', 42);
    
    expect(namespace.traverse(root, 'a.b.c.d.e')).toBe(42);
    expect(namespace.traverse(root, 'this.a.b.c.d.e')).toBe(42);
});


test("dk.namespace.update", () => {
    let a = {};
    namespace.update(a, {b:42});
    
    expect(a).toEqual({b:42});
});


test("dk.namespace.combine", () => {
    let res = namespace.combine(
        {a: 41},
        {b: 42}
    );
    
    expect(res).toEqual({a:41, b:42});
});


test("dk.namespace.merge", () => {
    expect(namespace.merge()).toBe(undefined);
    
    expect(namespace.merge(true, false)).toBe(true);
    expect(namespace.merge({}, false)).toEqual({});
    expect(namespace.merge(null, 42)).toEqual(42);
    
    expect(namespace.merge([1], [2])).toEqual([1, 2]);
    
    expect(namespace.merge({a:41}, {b:42})).toEqual({a:41, b:42});
    expect(namespace.merge({a:41}, {})).toEqual({a:41});
    expect(namespace.merge({}, {b:42})).toEqual({b:42});
    
    expect(namespace.merge("hello", "world")).toEqual("world");
    expect(namespace.merge("hello {_}", "world")).toEqual("hello world");
    expect(namespace.merge("hello", "{#} world")).toEqual("hello world");
    expect(() => namespace.merge("{_}", "{#}")).toThrow();
    
    expect(namespace.merge({a: true}, {b:false})).toEqual({a:true, b:false});
    expect(namespace.merge({a: true}, {a:false})).toEqual({a:false});
    expect(Object.keys(
        namespace.merge(
            {a: Symbol('hello')},
            {b: Symbol('world')})).length
    ).toEqual(2);
    expect(
        namespace.merge(
            {a: Symbol('hello')},
            {a: Symbol('world')})['a'].toString()
    ).toEqual("Symbol(world)");
    
    expect(() => namespace.merge({a: true}, {a:42})).toThrow();
    
});
