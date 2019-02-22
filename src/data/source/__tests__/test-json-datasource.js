import {JSONDataSource} from "../dk-json-datasource";
import jason from "../../datacore/dk-json";
import is from "../../../is";


test("json-datasource", async () => {
    const ds = new JSONDataSource({
        data: jason.parse(JSON.stringify({
            cols: [{
                label: "Prosjekt",
                name: "project",
                help_text: "project name",
                datatype: "fkey",
                widget: "SelectWidget",
                data: {
                    'proj-1': 'AFR-support',
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
                {
                    k: 1,
                    c: [
                        {v: 'proj-1', f: 'AFR-support'},
                        '@duration:13000'
                    ]
                },
                {
                    k: 2,
                    c: [
                        { v: 'proj-2', f: 'Generelt NT' },
                        '@duration:8542'
                    ]
                },
                {   k: 3,
                    c: [
                        {v: 'proj-2', f: 'Generelt NT'},
                        '@duration:8542'
                    ]
                },
                {
                    k: 4,
                    c: [
                        {v: 'proj-3', f: 'Tiktok'},
                        '@duration:12813'
                    ]
                }
            ]
        }))
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
    expect(records[0].project.f).toEqual('AFR-support');
    
    ds.get_records({}, function (rs) {
        const fields = rs.fields;
        expect(is.isEqual(Object.keys(fields), ['project', 'work'])).toBeTruthy();
        expect(fields.project.name).toEqual('project');
        expect(fields.project.pos).toBe(0);

        const records = rs.records;
        console.info("records:", records);
        expect(typeof Object.keys(records)[0]).toBe('string');  // record pk is a string
        expect(Object.keys(records)).toHaveLength(4);
        expect(records[0].project.f).toEqual('AFR-support');
    });

});
