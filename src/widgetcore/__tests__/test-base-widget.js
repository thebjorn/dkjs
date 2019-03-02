import {BaseWidget} from "../dk-base-widget";


test("test-base-widget", () => {
    const bw1 = new BaseWidget({hello: 'world'});
    expect(bw1.state).toEqual({});
    let count = 0;
    bw1.on('foo', bar => {
        ++count;
        expect(bar).toEqual('bar');
    });
    bw1.trigger('foo', 'bar');
    bw1.notify('foo', 'bar'); // deprecated
    expect(count).toBe(2);
});
