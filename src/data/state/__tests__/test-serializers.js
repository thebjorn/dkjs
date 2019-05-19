import $ from 'jquery';
import {encode_url_value, json_serializer} from "../serializers";

test("dk-encode", () => {
    const val = {
        foo: 'bar',
        ['dkcal.foo']: 3.141,
        bar: {foo: 42},
        foox: 'green'
    };
    // console.log($.param(val), $.param(val).length);
    //
    // const encval = dk_encode(val);
    // console.log(encval, encval.length);
    //
    // const encenc = encodeURIComponent(encval);
    // console.log(encenc, encenc.length);
    
    const urlval = encode_url_value(val);
    console.log(urlval, urlval.length);
    
    // const jsonval = json_serializer.encode(val);
    // console.log(jsonval, jsonval.length);
    //
    // const encjson = encodeURIComponent(jsonval);
    // console.log(encjson, encjson.length);
    
    expect(urlval).toEqual("eyJmb28iOiJiYXIiLCJka2NhbC5mb28iOjMuMTQxLCJiYXIiOnsiZm9vIjo0Mn0sImZvb3giOiJncmVlbiJ9");
});
