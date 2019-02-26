
import $ from 'jquery';
import {PagerWidget} from "../pager-widget";
import page from "../../widgetcore/dk-page";
import utidy from "../../browser/dk-html";


test("test-pagerwidget-1", () => {
    document.body.innerHTML = `
        <div id="work">
            
        </div>
    `;
    const work = $('#work');
    page.initialize(document);

    const pw = PagerWidget.create_inside(work, {
        pagecount: 50,
        curpage: 0
    });

    expect(document.getElementById('work')).toMatchSnapshot();
    // expect(utidy(work.html())).toEqual(utidy(`
    //     <ul style="margin-top: 0px; margin-bottom: 0px;" class="PagerWidget pagination" id="pager-widget">
    //         <li class="prev-nav"><a href="#">«</a></li>
    //         <li class="page active" page="1"><a href="#">1</a></li>
    //         <li class="page" page="2"><a href="#">2</a></li>
    //         <li class="page" page="3"><a href="#">3</a></li>
    //         <li class="ellipsis"><span>...</span></li>
    //         <li class="page" page="49"><a href="#">49</a></li>
    //         <li class="page" page="50"><a href="#">50</a></li>
    //         <li class="next-nav"><a href="#">»</a></li>
    //     </ul>
    // `));
});
