import {dkwarning} from "../dkwarning";


test("dkwarning", () => {
    expect(dkwarning("hello world")).toEqual("hello world");
    expect(dkwarning("hello world")).toEqual("");
});
