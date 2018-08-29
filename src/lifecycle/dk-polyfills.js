// Production steps of ECMA-262, Edition 6, 22.1.2.1
if (!Array.from) {
  Array.from = (function () {
    var toStr = Object.prototype.toString;
    var isCallable = function (fn) {
      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };
    var toInteger = function (value) {
      var number = Number(value);
      if (isNaN(number)) { return 0; }
      if (number === 0 || !isFinite(number)) { return number; }
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };
    var maxSafeInteger = Math.pow(2, 53) - 1;
    var toLength = function (value) {
      var len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    };

    // The length property of the from method is 1.
    return function from(arrayLike/*, mapFn, thisArg */) {
      // 1. Let C be the this value.
      var C = this;

      // 2. Let items be ToObject(arrayLike).
      var items = Object(arrayLike);

      // 3. ReturnIfAbrupt(items).
      if (arrayLike == null) {
        throw new TypeError('Array.from requires an array-like object - not null or undefined');
      }

      // 4. If mapfn is undefined, then let mapping be false.
      var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
      var T;
      if (typeof mapFn !== 'undefined') {
        // 5. else
        // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
        if (!isCallable(mapFn)) {
          throw new TypeError('Array.from: when provided, the second argument must be a function');
        }

        // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 2) {
          T = arguments[2];
        }
      }

      // 10. Let lenValue be Get(items, "length").
      // 11. Let len be ToLength(lenValue).
      var len = toLength(items.length);

      // 13. If IsConstructor(C) is true, then
      // 13. a. Let A be the result of calling the [[Construct]] internal method
      // of C with an argument list containing the single item len.
      // 14. a. Else, Let A be ArrayCreate(len).
      var A = isCallable(C) ? Object(new C(len)) : new Array(len);

      // 16. Let k be 0.
      var k = 0;
      // 17. Repeat, while k < len… (also steps a - h)
      var kValue;
      while (k < len) {
        kValue = items[k];
        if (mapFn) {
          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }
        k += 1;
      }
      // 18. Let putStatus be Put(A, "length", len, true).
      A.length = len;
      // 20. Return A.
      return A;
    };
  }());
}

if (!String.prototype.title) {
    String.prototype.title = function () {
        // from http://stackoverflow.com/a/6475125/75103

        let i, str, lowers, uppers;
        str = this.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });

        // Certain minor words should be left lowercase unless
        // they are the first or last words in the string
        lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At',
            'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'];
        const tolower = function (txt) {
            return txt.toLowerCase();
        };
        for (i = 0; i < lowers.length; i++)
            str = str.replace(new RegExp('\\s' + lowers[i] + '\\s', 'g'), tolower);

        // Certain words such as initialisms or acronyms should be left uppercase
        uppers = ['Id', 'Tv'];
        for (i = 0; i < uppers.length; i++)
            str = str.replace(new RegExp('\\b' + uppers[i] + '\\b', 'g'),
                uppers[i].toUpperCase());

        return str;
    };
}


if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (str) {
        return this.lastIndexOf(str, 0) === 0;
    };
}

if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (str) {
        return this.slice(-str.length) === str;
    };
}

// ECMAScript 6
if (!String.prototype.contains) {
    String.prototype.contains = function () {
        return String.prototype.indexOf.apply(this, arguments) !== -1;
    };
}

if (!String.prototype.format) {

    // from https://github.com/alexei/sprintf.js/blob/master/src/sprintf.js
    // with minor modifications to make it a String function by bjorn.

    /*! sprintf.js | Copyright (c) 2007-2013 Alexandru Marasteanu <hello at alexei dot ro> | 3 clause BSD license */
    const _vsprintf = (function () {
        const sprintf = function () {
            if (!sprintf.cache.hasOwnProperty(arguments[0])) {
                sprintf.cache[arguments[0]] = sprintf.parse(arguments[0]);
            }
            return sprintf.format.call(null, sprintf.cache[arguments[0]], arguments);
        };
    
        sprintf.format = function (parse_tree, argv) {
            let cursor = 1, tree_length = parse_tree.length, node_type = '', arg, output = [], i, k,
                match, pad, pad_character, pad_length;
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
            let _fmt = fmt, match = [], parse_tree = [], arg_names = 0;
            while (_fmt) {
                if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {
                    parse_tree.push(match[0]);
                } else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {
                    parse_tree.push('%');
                } else if ((match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-forsuxX])/.exec(_fmt)) !== null) {
                    if (match[2]) {
                        arg_names |= 1;
                        let field_list = [], replacement_field = match[2], field_match = [];
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

        let vsprintf = function (fmt, argv, _argv) {
             _argv = argv.slice(0);
             _argv.splice(0, 0, fmt);
             return sprintf.apply(null, _argv);
        };

        /**
         * helpers
         */
        function get_type(variable) {
            return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
        }

        function str_repeat(input, multiplier) {
            for (let output = []; multiplier > 0; output[--multiplier] = input) {/* do nothing */}
            //noinspection JSHint
            return output.join('');
        }

        return vsprintf;
    })();

    /*  [2018-08-24] we should move to template strings with substitutions!
     *  yes, I know this is evil, but it's also amazingly convenient:
     *
     *      "hello %s, pi = %.2f.".format('world', Math.PI);
     *   => "hello world, pi = 3.14."
     *
     *   Template strings should now be used instead.
     */
    String.prototype.format = function () {
        console.warn('"".format(..) is deprecated, use template strings with substitutions instead.');
        return _vsprintf(this, Array.prototype.slice.call(arguments));
    };
}
