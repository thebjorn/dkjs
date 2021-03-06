// @flow

/**
 * Convert ``id`` to a valid javascript identifier.
 *
 * @param id
 * @returns {*}
 */
export function id2name(id: string): string {
    return id.replace(/-/g, '_');
}

/**
 * Convert `MyClass` -> my-class.
 *
 * @param clsname
 * @returns {string}
 */
export function cls2id(clsname: string):string {
    return clsname.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}


/**
 *  Count the occurences of letter in string `s`.
 * @param s
 * @param letter
 * @returns {*}
 */
export function count_char(s: string, letter: string): number {
    const tmp = s.match(new RegExp(letter, 'g'));
    return tmp ? tmp.length : 0;
}

/**
 * Similar to Python's textwrap.dedent(), which removes common/leading
 * whitespace from the left of each line in txt.
 *
 * @param {string} txt - the text to dedent.
 * @returns {string}
 */
export function dedent(txt: string): string {
    if (!txt) return "";
    const lines = txt.split('\n');
    // start and end of lines to consider
    let start = 0;
    let end = lines.length - 1;
    
    // handle first line
    if (lines[0].match(/^\s*$/)) {
        lines[0] = '';
        ++start;
    }
    // handle last line
    if (lines[lines.length-1].match(/^\s*$/)) {
        lines[lines.length-1] = '';
        --end;
    }
    
    let indents = lines.slice(start, end).map(line => {
        const m = line.match(/(^[ \t]*)[^ \t\n]/);
        return m ? m[1] : "";
    });
    // indents = indents.filter(spc => spc > "");  // function (spc) { return spc > ""; });
    let margin = null;
    indents.forEach(indent => {
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
        txt = lines.join('\n').replace(new RegExp("^" + margin, "mg"), "");
    }
    return txt;
}

