
import {shallow_observer, deep_observer} from "../observable";

test("shallow_observer", () => {
    let obj = {
        hello: 'world',
        goodbye: {
            cruel: 'world2'
        }
    };
    let callargs = [];
    let obs = shallow_observer(obj, (...args) => {
        console.log("ARGS:", args);
        callargs.push(args);
    });
    
    obs.hello = 'new-world';
    expect(obj.hello).toBe('new-world');
    expect(callargs[0][1]).toEqual('hello');
    expect(callargs[0][2]).toEqual('new-world');

    obs.goodbye.cruel = 'nested-observe';
    expect(obj.goodbye.cruel).toBe('nested-observe');
    expect(callargs.length).toBe(1);
    // expect(callargs[1][0]).toEqual(['foo']);
    
});


test("deep_observer", () => {
    let obj = {
        hello: 'world',
        goodbye: {
            cruel: 'world2'
        }
    };
    let callargs = [];
    let obs = deep_observer(obj, (...args) => {
        console.log("ARGS:", args);
        callargs.push(args);
    });

    obs.hello = 'new-world';
    expect(obj.hello).toBe('new-world');
    let orig_obj, target, name, val;
    [orig_obj, target, name, val] = callargs[0];
    expect(name).toEqual('hello');
    expect(val).toEqual('new-world');

    obs.goodbye.cruel = 'nested-observe';
    expect(callargs.length).toBe(2);
    [orig_obj, target, name, val] = callargs[1];
    expect(obj.goodbye.cruel).toBe('nested-observe');
    
    expect(orig_obj).toMatchObject(obj);
    expect(target).toMatchObject({cruel: 'nested-observe'});
    expect(name).toEqual('cruel');
    expect(val).toEqual('nested-observe');
    
});
