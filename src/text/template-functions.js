
import {dedent as _dedent} from "../core/text-utils";

function _space(n) {
    let res = '';
    for (let i=0; i<n; i++) res += ' ';
    return res;
}

export function _indent(curpos, s) {
    // console.debug("INDENT:", curpos, s);
    if (!s) return "";
    const lines = s.replace('\t', '        ').split('\n');
    const indents = lines.map(line => {
        const m = line.match(/(^[ ]*)[^ \n]/);
        return (m ? m[1] : "").length;
    });
    const res = [lines[0]];
    // const cur_indent0 = Math.min(...indents);
    const cur_indent1 = Math.min(...indents.slice(1));
    
    if (cur_indent1 < curpos) {
        const spc = _space(curpos - cur_indent1);
        for (let i=1; i<lines.length; i++) {
            res.push(spc + lines[i]);
        }
    }
    // console.debug("RETURINGIN:INDENT:", res.join('\n'));
    return res.join('\n');
}

/**
 * Tag function for template strings.
 * 
 * Usage::
 * 
 *     dedent`..multi line string..`
 *     
 * common initial whitespace is removed from the resulting string.
 * 
 * @param strings       - array of strings
 * @param exprs         - array of expressions
 * @returns {string}
 */
export function dedent(strings, ...exprs) {
    const res = [];
    // strings.length === exprs.length + 1
    // text looks like:  str expr str expr str
    let curline = 0, 
        curpos = 0;
    
    for (let i = 0; i<strings.length-1; i++) {
        // console.debug("STRINGS:I:", i, strings[i], curline, curpos);
        const lines = strings[i].split('\n');
        curline += lines.length - 1;
        if (lines.length > 1) {
            curpos = lines.slice(-1).length;
        } else {
            curpos = strings[i].length;
        }
        // console.debug("NEWPOS:", curline, curpos);
        res.push(strings[i]);
        res.push(_indent(curpos, `${exprs[i]}`));
    }
    res.push(strings[strings.length-1]);
    const txt = res.join('');
    // console.debug("STRING:BEFORE:DEDENT:\n", txt);
    return _dedent(txt);
}
