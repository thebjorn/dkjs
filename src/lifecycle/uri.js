
/*
 *  Based on: parseUri 1.2.2
 *  (c) Steven Levithan <stevenlevithan.com>
 *  MIT License
 *  modifications by Bjorn..
 *   - don't use one character variable names
 *   - don't hard code key-length
 *   - rename variable names to something more intuitive..,
 */


export default function parse_uri(uri, argopts) {
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
            name: "queryKey",
            parser: /(?:^|&)([^&=]*)=?([^&]*)/g
        },
        parser: {
            strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
            loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
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
