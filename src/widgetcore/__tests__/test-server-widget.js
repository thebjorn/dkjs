
import $ from "jquery";
import utidy from "../../browser/dk-html";
import {ServerWidget} from "../server-widget";
import page from "../dk-page";
import dk from "../../dk-obj";


test("ServerWidget.no-template", () => {
    const w = new ServerWidget(null, {
        // url: 'http://localhost/<% hello %>/<% world %>/',
        url: 'http://localhost/hello/world/',
        hello: 'hello',
        world: 'world'
    });
    const mockfn = jest.fn();
    w.server_widget_call_ajax = mockfn;
        
    expect(w._url_is_template()).toBeFalsy();
    expect(mockfn.mock.calls).toHaveLength(0);
    expect(w.widget_url()).toEqual('http://localhost/hello/world/');
    // expect(w._get_urldata()).toMatchObject({});
    
    w.refresh();
    expect(mockfn.mock.calls).toHaveLength(1);
    const ajax_params = mockfn.mock.calls[0][0];
    expect(ajax_params.url).toEqual('http://localhost/hello/world/');
    let waiting = null,
        data = null;
    
    dk.on(w, 'fetch-data', param => {
        waiting = param.waiting;
        data = param.data;
    });
    
    ajax_params.success({hello: 1});
    expect(waiting).toBeFalsy();
    expect(data.hello).toBe(1);
});
