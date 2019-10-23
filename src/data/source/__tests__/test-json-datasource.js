import {JSONDataSource} from "../dk-json-datasource";
import jason from "../../datacore/dk-json";
import is from "../../../is";


const jsondata = () => jason.parse(JSON.stringify({
    cols: [{
        label: "Prosjekt",
        name: "project",
        help_text: "project name",
        datatype: "fkey",
        widget: "SelectWidget",
        data: {
            'proj-1': 'FOO-support',
            'proj-4': 'FOO-support',
            'proj-2': 'Generelt NT',
            'proj-3': 'Tiktok'
        }
    }, {
        label: "Work",
        name: "work",
        help_text: "work time period",
        datatype: "duration",
        widget: "DurationWidget"
    }],
    rows: [
        {k: 1, c: [{v: 'proj-1', f: 'FOO-support'}, '@duration:13000']},
        {k: 2, c: [{v: 'proj-2', f: 'Generelt NT'}, '@duration:8542']},
        {k: 3, c: [{v: 'proj-2', f: 'Generelt NT'}, '@duration:8542']},
        {k: 4, c: [{v: 'proj-3', f: 'Tiktok'}, '@duration:12813']}
    ],
    filter_data: {
        filter1: {
            hello: 'world'
        }
    }
}));



test("json-datasource-fetch-filter-data", async () => {
    const ds = new JSONDataSource({
        data: jsondata()
    });
    const filter1_data = await ds.fetch_filter_data('filter1');
    expect(filter1_data).toEqual({hello: 'world'});
});


test("json-datasource-get-filter-data", () => {
    const ds = new JSONDataSource({
        data: jsondata()
    });
    ds.get_filter_data('filter1', filter1_data => {
        expect(filter1_data).toEqual({hello: 'world'});
    });
});


test("json-datasource-update", async () => {
    const ds = new JSONDataSource({
        data: jsondata()
    });
    // console.log(ds);
    // console.log("ROWS:", ds.data);

    let rs = await ds.fetch_records({});
    expect(rs.records[0].project.f).toEqual('FOO-support');
    ds.update({
        1: {project: {oldval: {f:"FOO-support", v: 'proj-1'}, newval: {f:"BAR-support", v:'proj-4'}}}
    });
    rs = await ds.fetch_records({});
    console.log("RECORDS:", rs.records);
    expect(rs.records[0].project).toEqual({f:"BAR-support", v:'proj-4'});
});


test("json-datasource-sort", async () => {
    const ds = new JSONDataSource({
        data: jsondata()
    });
    // console.log(ds);
    // console.log("ROWS:", ds.data);

    let rs = await ds.fetch_records({sort:[{field: 'work', direction: 'asc'}]});
    console.log("RECORDS:", rs.records);
    expect(rs.records[0].work.value).toEqual(8542);

    rs = await ds.fetch_records({sort:[{field: 'work', direction: 'desc'}]});
    expect(rs.records[0].work.value).toEqual(13000);
});


test("json-datasource", async () => {
    const ds = new JSONDataSource({
        data: jsondata()
    });
    console.log(ds);
    console.log("ROWS:", ds.data);
    
    const rs = await ds.fetch_records({});

    const fields = rs.fields;
    expect(is.isEqual(Object.keys(fields), ['project', 'work'])).toBeTruthy();
    expect(fields.project.name).toEqual('project');
    expect(fields.project.pos).toBe(0);

    const records = rs.records;
    console.info("records:", records);
    expect(typeof Object.keys(records)[0]).toBe('string');  // record pk is a string
    expect(Object.keys(records)).toHaveLength(4);
    expect(records[0].project.f).toEqual('FOO-support');
    
    ds.get_records({}, function (rs) {
        const fields = rs.fields;
        expect(is.isEqual(Object.keys(fields), ['project', 'work'])).toBeTruthy();
        expect(fields.project.name).toEqual('project');
        expect(fields.project.pos).toBe(0);

        const records = rs.records;
        console.info("records:", records);
        expect(typeof Object.keys(records)[0]).toBe('string');  // record pk is a string
        expect(Object.keys(records)).toHaveLength(4);
        expect(records[0].project.f).toEqual('FOO-support');
    });

});
