import {DataPage} from "../dk-datapage";


test("test-datapage", () => {
    const p = new DataPage();
    // expect(p.fields).toHaveLength(0);
    expect(p).toBeTruthy();
});
