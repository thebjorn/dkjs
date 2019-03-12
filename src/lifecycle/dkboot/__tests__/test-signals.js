
import dk from "../../../dk-obj";
import {env} from "../lifecycle-parse-script-tag";
import {debugstr, publish, subscribe} from "../dk-signals";

test("signal-no-object", () => {
    env._debug = false;
    expect(() => dk.on()).toThrow();
    env._debug = true;
});


test("signal-after", () => {
    const obj = {
        hello() { return 'world'; }
    };
    let res = "";
    dk.after(obj, 'hello', (val) => {
        return "after" + val;
    });
    res += obj.hello();
    expect(res).toEqual("afterworld");
});


test("signal-debugstr", () => {
    expect(debugstr(42)).toEqual("42");
    expect(debugstr(document.createElement('h1'))).toEqual('H1');
    const h1 = document.createElement('h1');
    h1.setAttribute('id', 'hello');
    expect(debugstr(h1)).toEqual('H1#hello');
    let obj = {
        toString() { throw "bad object!"; }
    };
    expect(debugstr(obj)).toEqual("[error converting obj to string]");
});


test("signal-deprecated", () => {
    const obj = {
        hello() { return 'world'; }
    };
    let res;
    subscribe(obj, 'hello', (val) => {
        res = val;
    });
    publish(obj, 'hello', 42);
    expect(res).toBe(42);
});
