import {DkDate} from "../dk-datatypes";
import json from "../dk-json";


test("json.stringify", () => {
    expect(json.stringify([new DkDate("@date:2019-01-27")])).toBe('["@date:2019-01-27"]');
    
    expect(json.parse('["@date:2019-01-27"]')).toEqual([new DkDate("@date:2019-01-27")]);
    // expect(json.parse('["@datex:2019-01-27"]')).toEqual([new DkDate("@date:2019-01-27")]);
});
