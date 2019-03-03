import {ArraySource} from "../dk-array-datasource";


test("array-datasource-get_fields-empty", () => {
    const ds = new ArraySource({
        data: []
    });

    const fields = ds.get_fields();
    expect(Object.keys(fields)).toEqual([]);
});


test("array-datasource-get_fields()", () => {
    const ds = ArraySource.create({
        data: [
            {project: 'Generelt NT', work: '1:03:57'},
            {project: 'Tiktok',      work: '2:44:57'},
            {project: 'FOO-support', work: '1:06:43'}
        ]
    });

    const fields = ds.get_fields();
    console.info('fields:', fields);
    console.info('keys:', Object.keys(fields), ['project', 'work']);
    expect(Object.keys(fields)).toEqual(['project', 'work', 'pk']);
    expect(fields.project.name).toBe('project');
    expect(fields.project.pos).toBe(0);
});


test("array-datasource-get_records()", () => {
    const ds = new ArraySource([
        {project: 'first', work: '1:03:57'},
        {project: 'aTiktok', work: '2:44:57'},
        {project: 'bGenerelt NT', work: '1:03:57'},
        {project: 'cTiktok', work: '2:44:57'},
        {project: 'dGenerelt NT', work: '1:03:57'},
        {project: 'eTiktok', work: '2:44:57'},
        {project: 'fGenerelt NT', work: '1:03:57'},
        {project: 'gTiktok', work: '2:44:57'},
        {project: 'hGenerelt NT', work: '1:03:57'},
        {project: 'iTiktok', work: '2:44:57'},
        {project: 'jGenerelt NT', work: '1:03:57'},
        {project: 'kTiktok', work: '2:44:57'},
        {project: 'last', work: '1:06:43'}
    ]);

    ds.get_records({}, function (rs) {
        expect(Object.keys(rs.records)).toHaveLength(13);
        console.log("recs", Object.keys(rs.records));
        expect(typeof Object.keys(rs.records)[0]).toBe('string');
        expect(rs.records["1"].project).toBe('aTiktok');
        expect(rs.records["0"].project).toBe('first');
        expect(rs.records["12"].project).toBe('last');
    });
});


test("array-datasource-fetch_records()", async () => {
    const ds = new ArraySource([
        {project: 'first', work: '1:03:57'},
        {project: 'aTiktok', work: '2:44:57'},
        {project: 'bGenerelt NT', work: '1:03:57'},
        {project: 'cTiktok', work: '2:44:57'},
        {project: 'dGenerelt NT', work: '1:03:57'},
        {project: 'eTiktok', work: '2:44:57'},
        {project: 'fGenerelt NT', work: '1:03:57'},
        {project: 'gTiktok', work: '2:44:57'},
        {project: 'hGenerelt NT', work: '1:03:57'},
        {project: 'iTiktok', work: '2:44:57'},
        {project: 'jGenerelt NT', work: '1:03:57'},
        {project: 'kTiktok', work: '2:44:57'},
        {project: 'last', work: '1:06:43'}
    ]);
    const rs = await ds.fetch_records({});
    expect(Object.keys(rs.records)).toHaveLength(13);
    console.log("recs", Object.keys(rs.records));
    expect(typeof Object.keys(rs.records)[0]).toBe('string');
    expect(rs.records["1"].project).toBe('aTiktok');
    expect(rs.records["0"].project).toBe('first');
    expect(rs.records["12"].project).toBe('last');
});


test("array-datasource-search", async () => {
    const ds = new ArraySource([
        {project: 'first', work: '1:03:57'},
        {project: 'aTiktok', work: '2:44:57'},
        {project: 'bGenerelt NT', work: '1:03:57'},
        {project: 'cTiktok', work: '2:44:57'},
        {project: 'dGenerelt NT', work: '1:03:57'},
        {project: 'eTiktok', work: '2:44:57'},
        {project: 'fGenerelt NT', work: '1:03:57'},
        {project: 'gTiktok', work: '2:44:57'},
        {project: 'hGenerelt NT', work: '1:03:57'},
        {project: 'iTiktok', work: '2:44:57'},
        {project: 'jGenerelt NT', work: '1:03:57'},
        {project: 'kTiktok', work: '2:44:57'},
        {project: 'last', work: '1:06:43'}
    ]);
    const rs = await ds.fetch_records({search:'Tiktok'});
    expect(rs.records).toHaveLength(6);
});
