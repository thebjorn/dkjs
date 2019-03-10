
import dk from "../../../dk-obj";
import {env} from "../lifecycle-parse-script-tag";

// test("signal-no-object", () => {
//     env._debug = false;
//     expect(dk.on()).toThrow();
//     env._debug = true;
// });


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
