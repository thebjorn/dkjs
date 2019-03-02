import {DataWidget} from "../data-widget";
import {BaseWidget} from "../dk-base-widget";


test("test-data-widget-isequal", () => {
    const dw1 = new DataWidget({data: {hello: 'world'}});
    const dw2 = new DataWidget({data: {hello: 'world'}});
    
    expect(dw1.isEqual(dw2)).toBeTruthy();
    expect(dw2.isEqual(dw1)).toBeTruthy();
    expect(dw2.isEqual(dw2)).toBeTruthy();
    
    const bw1 = new BaseWidget({data: {hello: 'world'}});
    expect(dw1.isEqual(bw1)).toBeFalsy();
});


test("test-base-widget-isequal", () => {
    const bw1 = new BaseWidget({data: {hello: 'world'}});
    const bw2 = new BaseWidget({data: {hello: 'world'}});

    expect(bw1.isEqual(bw2)).toBeFalsy();
    expect(bw2.isEqual(bw1)).toBeFalsy();
    expect(bw2.isEqual(bw2)).toBeTruthy();
});
