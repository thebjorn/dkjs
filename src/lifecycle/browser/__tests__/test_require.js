
import $ from "jquery";
import utidy from "../../../browser/dk-html";
import {Widget} from "../../../widgetcore/dk-widget";
import page from "../../../widgetcore/dk-page";

import {state, dkrequire_urls, dkrequire, dkrequire_css, dkrequire_js, dkrequire_loaded} from "../dk-require";


test("state initial", () => {
    expect(state).toMatchObject({});
});


test("dkrequire google font", () => {
    document.head.innerHTML = `
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.slim.min.js"></script>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    `;
    // document.body.innerHTML = `
    // <div id="work">
    // </div>
    // `;
    // const work = $('#work');
    // page.initialize(document);

    const url = 'https://fonts.googleapis.com/css?family=Exo+2:100,200,300,400,500';
    const src = dkrequire_css(url);
    console.dir(src);
    console.log(document.head.innerHTML);
    expect(Object.keys(state).length).toBe(3);
    expect(src.host).toEqual('fonts.googleapis.com');
    expect(dkrequire_loaded(url)).toBeTruthy();

    const jqurl = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.slim.min.js";
    const jqsrc = dkrequire_js(jqurl);
    let callbackval;
    const jqsrc2 = dkrequire(jqurl, src => callbackval = src);
    console.dir('callback', callbackval);
    // expect(callbackval.source).toEqual(jqurl);
    expect(jqsrc.libname).toEqual('jquery.slim');

    dkrequire('[fetch:js]https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js');
    // expect(utidy(work.html())).toEqual(utidy(`
    //     <div class="Widget foo" id="widget">
    //         Hello World!
    //     </div>
    // `));
});
