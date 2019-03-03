import $ from 'jquery';
import utidy from "../../browser/dk-html";
import page from "../../widgetcore/dk-page";
import {help} from "../help";


test("test-help", () => {
    document.body.innerHTML = `
        <div id="work">
            <h1 class="help">Hello
                <div title="help-title" class="help-text">world</div>
            </h1>
        </div>
    `;
    const work = $('#work');
    page.initialize(document);
    let callargs = null;
    $.fn.popover = function (...args) {
        callargs = args[0];
    };
    
    help('#work');
    
    console.log(work.html());
    console.log('CALLARGS', callargs);
    
    expect(callargs.title).toEqual('help-title');
    expect(callargs.trigger).toEqual('focus');
    expect(callargs.content).toEqual('world');
    
    
    expect(work.html()).toMatchSnapshot();
});
