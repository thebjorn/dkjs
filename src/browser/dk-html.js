
import dom from "./dom";
import Class from "../lifecycle/coldboot/dk-class";


class HtmlTag extends Class {
    constructor(txt) {
        super();
        // noinspection JSUnusedGlobalSymbols
        this.orig = txt;
        this.text = txt.replace(/\s+/g, " ");                         // collapse multiple spaces
        const m = this.text.match(/<\s*(\/)?\s*([-\w]+)(\s.*)?>/i);   // find closing-marker, tag-name, and 'rest'
        if (m === null) throw `not a tag: ${txt}`;
        this.closing = m[1] !== undefined;
        this.name = m[2];
        if (this.name === 'dk-icon') this.name = 'dkicon';
        this.attrtxt = (m[3] || "").trim();
        this.selfclosing = dom.is_self_closing(this.name);
        if (!this.closing && this.attrtxt) {
            this.attrs = this.normalize_attrs(this.attrtxt.match(/([-\w]+)((=['"](.*?)['"])|(=([^\s]+)))?/g));
        } else {
            this.attrs = [];
        }
        this.kind = 'tag';
        if (this.closing) this.kind += '-end';
        if (!this.closing && !this.selfclosing) this.kind += '-start';
    }
    static normalize_class(val) {
        const classes = val.split(/ /);
        classes.sort();
        return classes.join(' ');
    }
    static normalize_style(val) {
        const styles = val.replace(/&quot;/g, '').split(/;/).map(function (s) {
            return s.replace(/\s+/g, '')
                .replace('rgb(255,192,203)', 'pink')
                .replace(/border-.*radius:.*/, '')
                .replace(/calc\(.*?\)/, 'calc()');
        }).filter(function (v) {
            return v.length > 0;
        });
        styles.sort();
        return styles.join(';') + ';';
    }
    normalize_attrs(attrs) {
        if (attrs === null) return [];
        attrs.sort();
        let res = attrs.map(val => {
            const m = val.match(/([-\w]+)((=['"](.*?)['"])|(=([^\s]+)))?/);
            const attrname = m[1];
            const attrval = m[4] || m[6] || attrname;
            switch (attrname) {
                case 'class':
                    return ['class', HtmlTag.normalize_class(attrval)];
                case 'dkwidget':
                    return ['dk-widget-attr', attrval];
                case 'style':
                    return ['style', HtmlTag.normalize_style(attrval)];
                case 'id':
                    return ['id', attrval.replace(/(.*?)-\d+/, "$1")];
                case 'for':
                    return ['for', attrval.replace(/(.*?)-\d+/, "$1")];
                default:
                    return [attrname, attrval];
            }
        });

        // special handling of certain tags..
        switch (this.name) {
            case 'dkicon':
                // the expansion of attributes is causing problems in the test framework,
                // and only the initial value attribute is relevant.
                res = res.filter(function (item) { return item[0] === 'value'; });
                break;
        }
        return res;
    }
    toString() {
        if (this.closing) return `</${this.name}>`;
        let res = `<${this.name}`;
        if (this.attrtxt) {
            res += " ";
            res += this.attrs.map(([k, v]) => {
                return `${k}="${v}"`;
            }).join(' ');
        }
        res += '>';
        return res;
    }
}


function tokenize_html(html) {
    const tokens = [];
    let pos = 0;
    const tagre = /(<.*?>)/img;
    let m, txt, tag;
    while ((m = tagre.exec(html)) !== null) {
        txt = html.slice(pos, m.index).trim();
        if (txt) tokens.push({kind: 'text', token: txt});
        tag = HtmlTag.create(html.slice(m.index, tagre.lastIndex));
        tokens.push({kind: tag.kind, token: tag});
        pos = tagre.lastIndex;
    }
    if (pos < html.length) tokens.push({kind: 'text', token: html.slice(pos).trim()});
    return tokens;
}


export default function utidy(html, level, indent) {
    if (level === undefined) level = 0;
    if (indent === undefined) indent = '    ';
    const _indent = function (n) {
        var res = '';
        for (var j = 0; j < Math.max(0, n); j++) {
            res += indent;
        }
        return res;
    };

    const tokens = tokenize_html(html.trim());
    const res = [];
    let i = level;
    tokens.forEach(tk => {
        switch (tk.kind) {
            case 'text':
                res.push(_indent(i) + tk.token);
                break;
            case 'tag-start':
                res.push(_indent(i++) + tk.token);
                break;
            case 'tag-end':
                res.push(_indent(--i) + tk.token);
                break;
            case 'tag':
                res.push(_indent(i) + tk.token);
                break;
        }
    });
    return res.join('\n');
}
