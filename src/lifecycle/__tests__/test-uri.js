

import {parse_src} from "../uri";


test("uri.parse_src", () => {
    const url = "https://static.datakortet.no/dk/dk.min-1.2.4.js";
    const src = parse_src(url);
    console.log(src);
    
    expect(src.version).toEqual('1.2.4');
    expect(src.filetype).toBe('.js');
    expect(src.minified).toBe(true);
    expect(src.libname).toBe('dk');
});


test("uri.parse_src2", () => {
    const url = "https://static.datakortet.no/dk/dk.min-1.2.4b.js";
    const src = parse_src(url);
    console.log(src);

    expect(src.version).toEqual('1.2.4b');
    expect(src.filetype).toBe('.js');
    expect(src.minified).toBe(true);
    expect(src.libname).toBe('dk');
});





test("uri.parse_src3", () => {
    const url = "https://static.datakortet.no/font/fa470/css/font-awesome.css";
    const src = parse_src(url);
    console.log(src);

    expect(src.version).toEqual('470');
    expect(src.filetype).toBe('.css');
    expect(src.minified).toBe(false);
    expect(src.libname).toBe('font-awesome');
});
