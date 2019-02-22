
import {DataSource} from "../dk-datasource-base";


test("test-datasource-defaults", () => {
    const ds = new DataSource();
    expect(ds.get_defaults({}).start).toBe(0);
    expect(ds.get_defaults({}).end).toBe(25);
    expect(ds.get_defaults({}).sort).toEqual([]);
});


test("test-datasource-get-records", () => {
    const ds = new DataSource();
    ds.get_records({}, data => {
        expect(Object.keys(data.fields)).toHaveLength(0);
        expect(Object.keys(data.meta)).toHaveLength(0);
        expect(Object.keys(data.records)).toHaveLength(0);
    });
});


test("test-datasource-fetch-records", async () => {
    const ds = new DataSource();
    const data = await ds.fetch_records({});
    expect(Object.keys(data.fields)).toHaveLength(0);
    expect(Object.keys(data.meta)).toHaveLength(0);
    expect(Object.keys(data.records)).toHaveLength(0);
});


test("test-datasource-get-filter-data", () => {
    const ds = new DataSource();
    ds.get_filter_data({}, data => {
        expect(data.missing).toBe('data missing');
        expect(data.need_to).toBe("need to implement get_filter_data in datasource");
    });
});


test("test-datasource-get-fields", () => {
    const ds = new DataSource();
    expect(Array.isArray(ds.get_fields())).toBeTruthy();
    expect(ds.get_fields()).toHaveLength(0);
});
