
import {datatype, DkDate} from "../dk-datatypes";


test("DkDate.tag", () => {
    expect(DkDate.tag).toBe('@date:');
    expect((new DkDate(1)).constructor.tag).toBe('@date:');
});


test("decorator-test", () => {


    function set_bar(cls) {
        if (cls.kind !== 'class') throw `not class ${kind}`;
        console.log("KIND:", cls.kind);

        // cls.elements.push(...Object.entries(props));
        cls.elements.push({
            kind: 'field',
            key: 'bar',
            placement: 'static',
            // placement: 'prototype',
            // placement: 'own',
            descriptor: {
                configurable: true,
                enumerable: true,
                writable: true
            },
            initializer: () => 'bar'
        });
        console.log("ELEMENTS:", cls.elements);
        // return cls;
        return {
            kind: 'class',
            elements: cls.elements
        };
    }


    @set_bar
    class Foo {
        value = 42;
    }

    console.log("Object.keys(Foo)", Object.keys(Foo));
    console.log("Object.keys(Foo.prototype)", Object.keys(Foo.prototype));
    console.log("Object.keys(new Foo())", Object.keys(new Foo()));

    console.log("Foo.bar:", Foo.bar);
    console.log("(new Foo).bar:", (new Foo).bar);

    console.log("Foo.value:", Foo.value);
    console.log("(new Foo).value):", (new Foo).value);


    expect(1).toBe(1);
});

test("get-datatypes", () => {
    console.log(datatype);
    console.log(Object.keys(datatype.get_datatypes()).length);
    // expect(Object.keys(datatype.get_datatypes()).length).toBe(0);
    let X = DkDate;
    let Y = new DkDate('@date:2019-01-23');
    console.log('hello');
    expect(Object.keys(datatype.get_datatypes())).toEqual([
        '@date:', '@datetime:', '@duration:'
    ]);
});


test("DkDate", () => {
    const a = new DkDate('@date:2019-01-23');
    
    console.log("A:TO_STRING:", a);
    console.log("A:TO_STRING:", a.toString('Y-m-d'));
    console.log("NAME:", DkDate.name);
    
    expect(a.toString('Y-m-d')).toEqual('2019-01-23');
    expect(a.toString()).toEqual('2019-01-23');
    expect(a.toJSON()).toEqual('@date:2019-01-23');
    
    const b = DkDate.create('@date:2019-01-23');

    expect(b.toString('Y-m-d')).toEqual('2019-01-23');
    expect(b.toString()).toEqual('2019-01-23');
    expect(b.toJSON()).toEqual('@date:2019-01-23');
});


