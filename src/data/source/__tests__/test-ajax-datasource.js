import {AjaxDataSource} from "../dk-ajax-datasource";
import $ from "jquery";


// FIXME: find/create an url that returns filter data

test("dummy-test-42", () => {
    expect(1).toBe(1);
});

// test("test-ajax-datasource-get-filter-data", done => {
//     // $['ajax'] = jest.fn(obj => obj);
//     let success_args = null;
//
//     const ds = new AjaxDataSource({
//         // url: "https://cache.norsktest.no/ajax/poststed/9900/"
//         // url: "https://www.finaut.no/resultlist/"
//         url: "https://www.xn--solarieprven-3jb.no/dkcal/1/calendar/1/events/"
//     });
//
//     ds.get_filter_data("posts", data => {
//         success_args = data;
//         console.log("DATA:", data);
//         expect(success_args).toEqual({hello: 'world'});
//         done();
//     });
//
//     // waitFor(() => {
//     //     console.log('in wait for..');
//     //     return !!success_args;
//     // }, "get-filter-data to return", 2000);
//
//     // console.dir("$AJAX:", $.ajax);
//     console.log("SUCC:ARGS:", success_args);
//     // console.log("AJAX:ARGS:", ajax_args);
//
//
//     // expect(ds._axdata()).toMatchObject({end: 25});
//     // runs(() => {
//     //     expect(success_args).toEqual({hello: 'world'});
//     // });
//     // expect(1).toBe(0);
// });
