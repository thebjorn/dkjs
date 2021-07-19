

import $ from 'jquery';
import {async_json, json} from "../dk-client";


test("json", () => {
    $['ajax'] = jest.fn(obj => obj);
    let success_args = null;
    let ajax_args = json({
        url: '#foo',
        data: {foo: 'bar'},
        success: function (data) {
            success_args = data;
        }
    });
    expect(ajax_args.cache).toBeFalsy();
    expect(ajax_args.dataType).toBe('json');
    expect(ajax_args.url).toBe('#foo');
    expect(ajax_args.data).toEqual(JSON.stringify({foo:'bar'}));
    expect(ajax_args.contentType).toEqual('application/json; charset=utf-8');
    
    // coverage without tests
    ajax_args.statusCode[404]();
    ajax_args.statusCode[409]('xhr', 'textstatus', 'error');
    ajax_args.statusCode[500]();
    ajax_args.error("req", "status", "err");

    console.dir($.ajax);
    console.log("SUCC:ARGS:", success_args);
    console.log("AJAX:ARGS:", ajax_args);

});


test("async-json", async () => {
    $['ajax'] = jest.fn(obj => obj);
    let success_args = null;
    let ajax_args = await async_json({
        url: '#foo',
        data: {foo: 'bar'},
        success: function (data) {
            success_args = data;
        }
    });
    expect(ajax_args.cache).toBeFalsy();
    expect(ajax_args.dataType).toBe('json');
    expect(ajax_args.url).toBe('#foo');
    expect(ajax_args.data).toEqual(JSON.stringify({foo:'bar'}));
    expect(ajax_args.contentType).toEqual('application/json; charset=utf-8');

    // coverage without tests
    ajax_args.statusCode[404]();
    ajax_args.statusCode[409]('xhr', 'textstatus', 'error');
    ajax_args.statusCode[500]();
    ajax_args.error("req", "status", "err");

    console.dir($.ajax);
    console.log("SUCC:ARGS:", success_args);
    console.log("AJAX:ARGS:", ajax_args);

});
