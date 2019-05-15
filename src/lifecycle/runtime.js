
import parse_uri from "./uri";

function find_version(uriobj) {
    let match = /[-.@\/](\d+\.\d+\.\d+)[.\/]/.exec(uriobj.name);
    if (match) return match[1];
    
    match = /[-.@\/](\d+\.\d+\.\d+)[.\/]/.exec(uriobj.path);
    if (match) return match[1];
    
    match = /\/v(\d)\//.exec(uriobj.name);
    if (match) return match[1];
    
    return null;
}

function plain_name(urlobj) {
    return urlobj.name;
}

export class RuntimeEnvironment {
    constructor() {
        this.scripts = [];
        // for (const script of document.scripts) {
        for (let i=0; i<document.scripts.length; i++) {
            const script = document.scripts[i];
            let stag = parse_uri(script.getAttribute('src'));
            stag.version = find_version(stag);
            stag.libname = plain_name(stag);
            this.scripts.push(stag);
        }
    }
    
    
    get dkdj_script_tag() {
        for (const script of this.scripts) {
            console.log("dkdj script tag get:", script.version, script.libname, script);
        }
        return 42;
    }
}


class ScriptTag {
    constructor(url) {
        this.url = url;
        this.fname = ScriptTag.url2name(url);
        this.protocol = null;
        this.host = null;
        this.path = null;
        this.version = null;
        this.query = null;
        this.version = null;
        this.minified = false;
    }
    
    
    static url2name(url) {
        return url.split('/').slice(-1)[0];
    }
    
}
