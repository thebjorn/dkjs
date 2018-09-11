
var jqp = require('./dk-jqplugins.js');


/*
 *  Return a unique counter value.
 *  The optional ``name`` parameter, will create a label
 *  ``name``<counter>, where the counter starts from startval
 *  (default 1).
 */
const _counters = {
    _default: 1
};

export function counter(name, startval) {
    if (!name && !startval) return _counters._default++;
    if (!_counters[name]) {
        if (!startval) startval = 1;
        _counters[name] = startval;
    }
    return name + _counters[name]++;
}


/**
 * Convert ``id`` to a valid javascript identifier.
 *
 * @param id
 * @returns {*}
 */
export function id2name(id) {
    return id.replace(/-/g, '_');
}

/**
 * Convert `MyClass` -> my-class.
 *
 * @param clsname
 * @returns {string}
 */
export function cls2id(clsname) {
    return clsname.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}


/**
 *  Count the occurences of letter in string `s`.
 * @param s
 * @param letter
 * @returns {*}
 */
export function count_char(s, letter) {
    return s.match(new RegExp(letter, 'g')).length;
}

/**
 * Similar to Python's textwrap.dedent(), which removes common/leading
 *  whitespace from the left of each line in txt.
 *
 * @param txt
 * @returns {*}
 */
export function dedent(txt) {
    if (!txt) return "";
    var lines = txt.split('\n');
    var indents = lines.map(function (line) {
        var m = line.match(/(^[ \t]*)[^ \t\n]/);
        return m ? m[1] : "";
    });
    indents = indents.filter(function (spc) { return spc > ""; });
    var margin = null;
    indents.forEach(function (indent) {
        if (margin === null) {
            margin = indent;
        } else if (indent.startsWith(margin)) {
            // do nothing
        } else if (margin.startsWith(indent)) {
            margin = indent;
        } else {
            margin = "";
        }
    });
    
    if (margin) {
        txt = txt.replace(new RegExp("^" + margin, "mg"), "");
    }
    return txt;
}


export default {
    // help: jqp.help,
    // lifecycle: require('./dk-lifecycle.js'),
    // counter: require('./dk-counter.js')
    counter,
    text: {
        id2name: id2name,
        cls2id: cls2id,
        count: count_char,
        dedent: dedent
    }
};
