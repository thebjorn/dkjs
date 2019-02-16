
import utidy from "../dk-html";


test("dkhtml.utidy", () => {
    const htxt = utidy("<span class='foo bar' id=hello-2 data-value=42 style='color:blue; cursor: url(http://foo.bar/x.cur), pointer'>hello world</span>");
    expect(htxt).toEqual('<span class="bar foo" data-value="42" id="hello" style="color:blue;cursor:url(http://foo.bar/x.cur),pointer;">\n    hello world\n</span>');
});


test("multiline-input tag", () => {
    const inp = `
        <input 
            class="TextInputWidget" 
            id="text-input-widget-1">`;
    
    expect(utidy(inp)).toEqual(utidy(`
        <input class="TextInputWidget" id="text-input-widget-1">
    `));
});
