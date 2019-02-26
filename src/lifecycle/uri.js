
/*
 *  Based on: parseUri 1.2.2
 *  (c) Steven Levithan <stevenlevithan.com>
 *  MIT License
 *  modifications by Bjorn..
 *   - don't use one character variable names
 *   - don't hard code key-length
 *   - rename variable names to something more intuitive..,
 */


export function parse_uri(uri, argopts) {
    const defopts = {
        strictMode: false,
        key: [
            "source",
            "protocol",
            "authority",
            "userInfo",
            "user",
            "password",
            "host",
            "port",
            "relative",
            "path",
            "directory",
            "file",
            "query",
            "anchor"
        ],
        query: {
            name: "query_key",
            parser: /(?:^|&)([^&=]*)=?([^&]*)/g
        },
        parser: {
            strict: /^(?:([^:/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:/?#]*)(?::(\d*))?))?((((?:[^?#/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
            loose: /^(?:(?![^:@]+:[^:@/]*@)([^:/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#/]*\.[^?#/.]+(?:[?#]|$)))*\/?)?([^?#/]*))(?:\?([^#]*))?(?:#(.*))?)/
        }
    };
    let opts = Object.assign({}, defopts, argopts);
    let match = opts.parser[opts.strictMode? "strict": "loose"].exec(uri);

    let i = opts.key.length;
    let res = {};
    while (i--) res[opts.key[i]] = match[i] || "";  // zip(..)

    res[opts.query.name] = {};
    // key[12] == 'query'
    res[opts.key[12]].replace(opts.query.parser, function ($0, $1, $2) {
        if ($1) res[opts.query.name][$1] = $2;
    });

    // .name is the filename without extension
    if (res.file) res.name = res.file.replace(/\.\w*$/, '');

    return res;
}

export function is_ajax_url(s) {
    if (typeof s !== 'string') return false;
    if (!s) return false;
    if (s.includes('\n')) return false;
    
    try {
        const parts = parse_uri(s);
        if (!parts.protocol) return is_ajax_url('http://example.com/' + s);
        return parts.protocol.match(/^https?/);
    } catch (e) {
        return false;
    }
}

function find_version(uriobj) {
    let match = /[-.@/](\d+\.\d+\.\d+)[./]/.exec(uriobj.name);
    if (match) return match[1];
    
    match = /[-.@/](\d+\.\d+\.\d+[b-z]?)[./]/.exec(uriobj.path);
    if (match) return match[1];
    
    match = /\/v(\d)\//.exec(uriobj.name);
    if (match) return match[1];
    
    match = /fa(\d+)/.exec(uriobj.source);
    if (match) return match[1];
    
    return null;
}

function is_minified(uriobj) {
    return /[-.]min[-.]/.test(uriobj.name);
}

function plain_name(urlobj) {
    if (!urlobj.name) return urlobj.source;
    let res = urlobj.name.replace(/[-.]min[-.]?/, '.');
    res = res.replace(/[-.@/](\d+\.\d+\.\d+[b-z]?)[./]?/, '');
    res = res.replace(/^[.]+/, '');
    res = res.replace(/[.]+$/, '');
    return res;
}

export function parse_src(uri) {
    // console.info("parsing:", uri);
    const src = parse_uri(uri);
    src.version = find_version(src);
    src.libname = plain_name(src);
    src.minified = is_minified(src);
    src.filetype = '.' + src.file.split('.').slice(-1);
    return src;
}
