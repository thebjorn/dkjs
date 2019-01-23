


// Original from https://github.com/alexei/sprintf.js/blob/master/src/sprintf.js
// modifications by bjorn.

/*! sprintf.js | Copyright (c) 2007-2013 Alexandru Marasteanu <hello at alexei dot ro> | 3 clause BSD license */
export const sprintf = (function () {
    const sprintf = function () {
        if (!sprintf.cache.hasOwnProperty(arguments[0])) {
            sprintf.cache[arguments[0]] = sprintf.parse(arguments[0]);
        }
        return sprintf.format.call(null, sprintf.cache[arguments[0]], arguments);
    };

    sprintf.format = function (parse_tree, argv) {
        let cursor = 1, tree_length = parse_tree.length, node_type = '', arg, output = [], i, k, match, pad, pad_character, pad_length;
        for (i = 0; i < tree_length; i++) {
            node_type = get_type(parse_tree[i]);
            if (node_type === 'string') {
                output.push(parse_tree[i]);
            } else if (node_type === 'array') {
                match = parse_tree[i]; // convenience purposes only
                if (match[2]) { // keyword argument
                    arg = argv[cursor];
                    for (k = 0; k < match[2].length; k++) {
                        if (!arg.hasOwnProperty(match[2][k])) {
                            throw(sprintf('[sprintf] property "%s" does not exist', match[2][k]));
                        }
                        arg = arg[match[2][k]];
                    }
                } else if (match[1]) { // positional argument (explicit)
                    arg = argv[match[1]];
                } else { // positional argument (implicit)
                    arg = argv[cursor++];
                }
                // [bp] added %r option..
                if (/[^rs]/.test(match[8]) && (get_type(arg) !== 'number')) {
                    throw('[sprintf] expecting number but found ' + get_type(arg));
                }
                switch (match[8]) {
                    case 'b':
                        arg = arg.toString(2);
                        break;
                    case 'c':
                        arg = String.fromCharCode(arg);
                        break;
                    case 'd':
                        arg = parseInt(arg, 10);
                        break;
                    case 'e':
                        arg = match[7]? arg.toExponential(match[7]): arg.toExponential();
                        break;
                    case 'f':
                        arg = match[7]? parseFloat(arg).toFixed(match[7]): parseFloat(arg);
                        break;
                    case 'o':
                        arg = arg.toString(8);
                        break;
                    case 'r':  // [bp] added %r option similar to the Python implementation (i.e. no .toSource()).
                        arg = JSON.stringify(arg);
                        break;
                    case 's':
                        arg = ((arg = String(arg)) && match[7]? arg.substring(0, match[7]): arg);
                        break;
                    case 'u':
                        arg = arg>>>0;
                        break;
                    case 'x':
                        arg = arg.toString(16);
                        break;
                    case 'X':
                        arg = arg.toString(16).toUpperCase();
                        break;
                }
                arg = (/[def]/.test(match[8]) && match[3] && arg >= 0? '+' + arg: arg);
                pad_character = match[4]? match[4] === '0'? '0': match[4].charAt(1): ' ';
                pad_length = match[6] - String(arg).length;
                pad = match[6]? str_repeat(pad_character, pad_length): '';
                output.push(match[5]? arg + pad: pad + arg);
            }
        }
        return output.join('');
    };

    sprintf.cache = {};

    sprintf.parse = function (fmt) {
        var _fmt = fmt, match = [], parse_tree = [], arg_names = 0;
        while (_fmt) {
            if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {
                parse_tree.push(match[0]);
            } else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {
                parse_tree.push('%');
            } else if ((match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-forsuxX])/.exec(_fmt)) !== null) {
                if (match[2]) {
                    arg_names |= 1;
                    var field_list = [], replacement_field = match[2], field_match = [];
                    if ((field_match = /^([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
                        field_list.push(field_match[1]);
                        while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
                            if ((field_match = /^\.([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
                                field_list.push(field_match[1]);
                            } else if ((field_match = /^\[(\d+)\]/.exec(replacement_field)) !== null) {
                                field_list.push(field_match[1]);
                            } else {
                                throw('[sprintf-1] huh?');
                            }
                        }
                    } else {
                        throw('[sprintf-2] huh?');
                    }
                    match[2] = field_list;
                } else {
                    //noinspection JSHint
                    arg_names |= 2;
                }
                if (arg_names === 3) {
                    throw('[sprintf] mixing positional and named placeholders is not (yet) supported');
                }
                parse_tree.push(match);
            } else {
                throw('[sprintf-3] huh?');
            }
            _fmt = _fmt.substring(match[0].length);
        }
        return parse_tree;
    };

    /**
     * helpers
     */
    function get_type(variable) {
        return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
    }

    function str_repeat(input, multiplier) {
        const output = []
        for (; multiplier > 0; output[--multiplier] = input) {/* do nothing */}
        //noinspection JSHint
        return output.join('');
    }

    return function(fmt, ...args) {
        const _args = [fmt];
        _args.push(...args);
        return sprintf(..._args);
    };
})();



export function twodigits(n) {
    return (n < 10? '0': '') + n; 
}


export function value(val, record, cell) {
    if (val === null) return "";
    //if (typeof val === "undefined") debugger;
    let v;
    if (val.v !== undefined) {
        if (val.f !== undefined) {
            v = val.f;
        } else {
            v = val.v? val.v: "";
        }
    } else if (!val) {
        v = "";
    } else {
        v = val;
    }
    return v.toString();
}


export function percent(val) {
    if (val === null) return "";
    return val + "%";
}


export function bool(trueval, falseval) {
    return function (val) {
        if (!!val) return trueval;
        return falseval;
    };
}

export function _no_date(v) {
    return sprintf('%02d.%02d.%04d', v.getDate(), v.getMonth() + 1, v.getFullYear());
}

export function no_date(val) {
    if (!val) return "";
    const v = val.value;
    return _no_date(v);
}

export function _no_datetime(v) {
    return sprintf('%02d.%02d.%04d kl.%02d.%02d:%02d',
        v.getDate(), v.getMonth() + 1, v.getFullYear(),
        v.getHours(), v.getMinutes(), v.getSeconds()
    );
}

export function no_datetime(val) {
    if (!val) return "";
    const v = val.value;
    return _no_datetime(v);
}


export default {
    twodigits,
    value,
    percent,
    bool,
    no_date,
    no_datetime,
    
    /*
     *  Convert val to string, based on its implied type.
     *  (keep as separate top level function so there aren't any proxy issues
     *  when using dk.format.value as a parameter).
     */
    format_value: function (val, record, cell) {
        return value(val, record, cell);
    }
    
};
