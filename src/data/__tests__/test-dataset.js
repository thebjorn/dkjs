
import dk from "../../dk-obj";
import {DataSet} from "../dk-dataset";
import {ArraySource} from "../source/dk-array-datasource";


test("test-dataset-functionality", () => {
    const mocksource = {
        get_records: function (request, returns) {
            returns({
                fields: {
                    col1: {name: 'col1'},
                    col2: {name: 'col2'}
                },
                records: [{
                    col1: 'foo',
                    col2: 42,
                    pk: "42"
                }, {
                    col1: 'bar',
                    col2: 14,
                    pk: "43"
                }]
            });
        }
    };

    const dataset = new DataSet({
        datasource: mocksource
    });
    console.log(dataset);
    console.log('-------------------------------');
    dk.on(dataset, 'fetch-data').run(function (dataset, page) {
        console.log("PAGE:", page);
        expect(page.__class__.name).toEqual('DataPage');
        expect(Object.keys(dataset.pages)).toHaveLength(1);
    });

    dataset.get_page();
    dataset.get_page({});
    dataset.get_page({pagenum:0});
});


test("test-dataset-from-arraysource", () => {
    const ds = DataSet.create({
        datasource: [
            {project: 'Generelt NT', work: '1:03:57'},
            {project: 'Tiktok', work: '2:44:57'},
            {project: 'FOO-support', work: '1:06:43'}
        ]
    });

    dk.on(ds, 'fetch-data').run(function (dataset, page) {
        expect(Object.keys(ds.pages)).toHaveLength(1);
        dk.info("page.records", page.records);
        expect(page.records).toHaveLength(3);
        dk.info("page.get_record(1):", page.get_record(1));
        if (page.get_record("1").project !== 'Tiktok') dk.error("page.get_record(1):", page.get_record(1));
        expect(page.get_record('1').project).toEqual('Tiktok');
    });

    ds.get_page();
    ds.get_page({});
    ds.get_page({pagenum: 0});
});
