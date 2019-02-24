import $ from 'jquery';
import {ResultSet} from "../resultset";
import page from "../../../../widgetcore/dk-page";


test("test-resultset-render", () => {
    document.body.innerHTML = `
        <div id="work">
            
        </div>
    `;
    const work = $('#work');
    page.initialize(document);
    
    ResultSet.create_inside(work);
    
    expect(document.getElementById('work')).toMatchSnapshot();
});
