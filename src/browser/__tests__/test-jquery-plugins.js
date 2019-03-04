
import $ from 'jquery';
import dk from "../../dk-obj";
import {jq_access_keys, jq_get_attributes, jq_help_button, jq_links2popup} from "../jquery-plugins";
import page from "../../widgetcore/dk-page";
import utidy from "../dk-html";


test("test-popup", () => {
    document.body.innerHTML = `
        <div id="work">
            <a id="my-window" href="/hello.html" width="100" height="100" class="popup"></a>
        </div>
    `;
    const work = $('#work');
    page.initialize(document);
    let call_args = null;
    let called_focus = false;
    window.open = (...args) => {
        call_args = args;
        return {
            focus() { called_focus = true; }
        };
    };
    
    jq_links2popup(dk);
    work.find('a').click();    
    console.log("CALL_ARGS:", call_args);
    
    expect(called_focus).toBeTruthy();
    let [url, window_name, window_params] = call_args;
    expect(url).toEqual('http://localhost/hello.html');
    expect(window_name).toEqual('my-window');
    expect(window_params.includes('width=100,height=100')).toBeTruthy();
});


test("access-keys", () => {
    document.body.innerHTML = `
        <div id="work">
            <form action="">
                <label id="a" accesskey="-">hello<input type="text"></label>
                <label id="b" accesskey="h">beautiful<input type="text"></label>
                <label id="c" accesskey="-">world<input type="text"></label>
            </form>
        </div>
    `;
    const work = $('#work');
    page.initialize(document);
    jq_access_keys(dk);
    
    work.accesskeys();
    
    console.log(work[0].outerHTML);
    console.log("A:", dk('#a'));
    expect(dk('#a').getAttribute('accesskey')).toBe('e');
    expect(dk('#b').getAttribute('accesskey')).toBe('h');
    expect(dk('#c').getAttribute('accesskey')).toBe('w');
});


// test("help", () => {
//     jq_help_button(dk);
//    
//     document.body.innerHTML = `
//         <div id="work" class="help">
//             <div class="help-text">hello world</div>
//         </div>
//     `;
//     const work = $('#work');
//     page.initialize(document);
//     $(document).ready();
//    
//     console.log(work[0].outerHTML);
//    
//     expect(1).toBe(1);
// });


test("test-getattributes", () => {
    document.body.innerHTML = `
        <div id="work">
            <a id="my-window" href="/hello.html" width="100" height="100" data-foo=42 class="popup"></a>
        </div>
    `;
    const work = $('#work');
    page.initialize(document);
    jq_get_attributes(dk);
    
    const attrs = work.find('a').getAttributes();
    console.log("ATTRS:", attrs);
    
    expect(Object.keys(attrs)).toEqual(['id', 'href', 'width', 'height', 'data', 'class']);
    expect(attrs.height).toBe("100");
    expect(attrs.width).toBe("100");
    expect(attrs.id).toBe("my-window");
    expect(attrs.data.foo).toBe("42");
});



test("test-getattributes-2", () => {
    document.body.innerHTML = `
        <div id="work">
            <a id="my-window" href="/hello.html" width="100" height="100" class="popup"></a>
            <a id="my-window2" href="/hello2.html" width="200" height="200" class="popup"></a>
        </div>
    `;
    const work = $('#work');
    page.initialize(document);
    jq_get_attributes(dk);

    const attrs = work.find('a').getAttributes();
    console.log("ATTRS:", attrs);

    expect(Object.keys(attrs)).toEqual(['id', 'href', 'width', 'height', 'class']);
    expect(attrs.height).toBe("100");
    expect(attrs.width).toBe("100");
    expect(attrs.id).toBe("my-window");
});
