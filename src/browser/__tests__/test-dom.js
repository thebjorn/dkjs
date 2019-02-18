
import $ from "jquery";
import dom from "../dom";
import {Template, DomItem} from "../dk-dom-template";


test("create_dom", () => {
    const node = dom.create_dom('h1', {["class"]: "foo bar baz"});
    expect(node.tagName).toBe('H1');
    expect($(node).hasClass('bar')).toBeTruthy();
});


test("dom.is_inline", () => {
    expect(dom.is_inline('span')).toBeTruthy();
});

test("dom.is_block", () => {
    expect(dom.is_block('div')).toBeTruthy();
});

test("dom.is_tag", () => {
    expect(dom.is_tag('article')).toBeTruthy();
});

test("dom.is_self_closing", () => {
    expect(dom.is_self_closing('hr')).toBeTruthy();
});


test("dom.equal", () => {
    document.body.innerHTML = `
        <div id="i1">
            <div>
                <h1>hello</h1>
                <span>world</span>
            </div>
        </div>
        <div id="i2">
            <div>
                <h1>hello</h1>
                <span>world</span>
            </div>
        </div>
        <div id="i3">
            <div>
            <h1>hello</h1>
                <span>world</span>
            </div>
        </div>
    `;
    const i1 = document.querySelector('#i1>div');
    const i2 = document.querySelector('#i2>div');
    const i3 = document.querySelector('#i3>div');
    
    expect(dom.equal(i1, i2)).toBeTruthy();
    expect(dom.equal(i2, i3)).toBeFalsy();
    
    const j1 = $('#i1>div');
    const j2 = $('#i2>div');
    const j3 = $('#i3>div');

    expect(dom.equal(j1, j2)).toBeTruthy();
    expect(dom.equal(j2, j3)).toBeFalsy();
});


test("dom.dkitem", () => {
    document.body.innerHTML = `
        <div id="i1">
            <div>
                <h1>hello</h1>
                <span>world</span>
            </div>
        </div>
    `;
    const i1 = $('#i1>div');
    const dk1 = dom.dkitem(i1);
    dk1.appendln('<p>pfoo</p>');
    console.log(dk1, dk1.html());
    expect(document.querySelector('p')).toBeTruthy();
});


test("dom.id", () => {
    document.body.innerHTML = `
        <div id="i1">hello</div>    
    `;
    expect(dom.id('i1')).toBeTruthy();
    // console.log(dom.id('i1'));
    // console.log('innerhtml', dom.id('i1').innerHTML);
    // console.log('innertext', dom.id('i1').innerText);
    // console.log('jq.text', $('#i1').text());
    // console.log('jq.text', $(dom.id('i1')).text());
    expect(dom.id('i1').innerHTML).toEqual('hello');
});

test("dom.one", () => {
    document.body.innerHTML = `
        <div>hello</div>    
        <div>world</div>    
    `;
    expect(dom.one('div')).toBeTruthy();
    expect(dom.one('div').innerHTML).toEqual('hello');
});


xtest("dom.here", () => {
    const jsdom = require('jsdom');
    const {JSDOM} = jsdom;
    
    // hook up jsdom console to regular console.
    const virtualConsole = new jsdom.VirtualConsole();
    virtualConsole.sendTo(console);
    
    
    const mydom = new JSDOM(`
        <div>
            <script>
                // console.info("HELLO from the inside");
                window.here_parent = here();
            </script>
        </div>
    `, {
        virtualConsole,
        runScripts: "dangerously",
        beforeParse(window) {
            window.here = name => dom.here(name, window.document);
        }
    });
    console.log("DOC:INNERHTML", mydom.window.here_parent.outerHTML);
    console.log("parent:", mydom.window.here_parent.tagName);
    expect(mydom.window.here_parent.tagName).toEqual('DIV');
    expect(mydom.window.here_parent.id).toEqual('dk-here-1');
});


test("dom.find", () => {
    document.body.innerHTML = `
        <div id="i1">
            <span>hello</span>
        </div>
        <div id="i2">
            <span>world</span>
        </div>    
    `;
    expect(dom.find('span', $("#i1")).text()).toEqual('hello');
    expect(dom.find('span', $("#i2")).text()).toEqual('world');
});





























