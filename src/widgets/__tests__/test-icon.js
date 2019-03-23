
import $ from "jquery";
import utidy from "../../browser/dk-html";
import {Widget} from "../../widgetcore/dk-widget";
import page from "../../widgetcore/dk-page";
import {icon, dkicon, jq_dkicons, _jq_convert_dkicon} from "../dk-icon-library";


test("test-icon", () => {
    document.body.innerHTML = `
    <div id="work">
    </div>
    `;
    $(document.head).append('<link rel="stylesheet" href="https://static.datakortet.no/font/fa470/css/font-awesome.css">');
    const work = $('#work');
    page.initialize(document);

    work.append(icon('close:fw'));    

    expect(utidy(work.html())).toEqual(utidy(`
        <i class="close fa fa-close fa-fw icon" icon="close" value="close:fw"></i>
    `));
});


test("test-dkicon", () => {
    document.body.innerHTML = `
        <div id="work">
        </div>
    `;
    $(document.head).append('<link rel="stylesheet" href="https://static.datakortet.no/font/fa470/css/font-awesome.css">');
    const work = $('#work');
    page.initialize(document);
    
    const icon = dkicon.append_to(work, {value: 'home'});
    expect(icon.value).toBe('home');
    icon.value = 'paw:3x,fw';
    
    console.log(work.html());
    expect(utidy(work.html())).toEqual(utidy(`
        <i class="dkicon fa fa-3x fa-fw fa-paw icon paw" icon="paw" id="dkicon" value="paw:3x,fw"></i>
    `));
});
//
// test("test-dk-icon", () => {
//     document.body.innerHTML = `
//         <div id="work">
//            
//         </div>
//     `;
//     const work = $('#work');
//     page.initialize(document);
//     const icon = new DK_ICON();
//     work.append(icon);
//    
//     console.log(work.html());
//    
//     expect(utidy(work.html())).toEqual(utidy(`
//        
//     `));
// });
test("test-jq_dkicons", () => {
    document.body.innerHTML = `
        <div id="work">
            <a href="foo/" dk-icon="close:fw">hello world</a>
        </div>
    `;
    $(document.head).append('<link rel="stylesheet" href="https://static.datakortet.no/font/fa470/css/font-awesome.css">'); 
    const work = $('#work');
    page.initialize(document);
    const dk = {$};
    $(document).ready();
    jq_dkicons(dk);
    _jq_convert_dkicon($);
    expect(utidy(work.html())).toEqual(utidy(`
        <a href="foo/" dk-icon="close:fw">
            <i class="close fa fa-close fa-fw icon" icon="close" value="close:fw"></i>
            hello world
        </a>
    `));
});
