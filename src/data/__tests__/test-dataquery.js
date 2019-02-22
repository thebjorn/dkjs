import {DataQuery} from "../dk-dataquery";


test("dataquery", () => {
    const dq = new DataQuery();
    expect(dq.pagesize).toBe(25);
    expect(dq.pagenum).toBe(0);
    expect(dq.start).toBe(0);
    expect(dq.end).toBe(25);
    
    console.log(dq._axdata());
    expect(dq._axdata()).toMatchObject({end: 25});
    
    expect(dq.toGetParams()).toEqual(`state=${encodeURIComponent(JSON.stringify({end:25}))}`);
});
