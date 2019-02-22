import {AjaxDataSource} from "../dk-ajax-datasource";


test("test-ajax-datasource", () => {
    const ds = new AjaxDataSource();
    
    expect(ds._axdata()).toMatchObject({end: 25});
});
