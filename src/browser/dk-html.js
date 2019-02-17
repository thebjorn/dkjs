
import dom from "./dom";
import Class from "../lifecycle/coldboot/dk-class";


class HtmlTag extends Class {
    constructor(txt, options) {
        super();
        this.options = options;
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
    normalize_class(val) {
        const classes = val.split(/ /);
        classes.sort();
        return classes.join(' ');
    }
    normalize_style(val) {
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
                    if (this.options.classes === false) return null;
                    return ['class', this.normalize_class(attrval)];
                case 'dkwidget':
                    return ['dk-widget-attr', attrval];
                case 'style':
                    if (this.options.style === false) return null;
                    return ['style', this.normalize_style(attrval)];
                case 'id':
                    return ['id', attrval.replace(/(.*?)-\d+/, "$1")];
                case 'for':
                    return ['for', attrval.replace(/(.*?)-\d+/, "$1")];
                default:
                    return [attrname, attrval];
            }
        }).filter(v => v != null);

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
            // console.log("ATTRS:", this.attrs);
            res += " ";
            res += this.attrs.map(([k, v]) => {
                // console.log("ATTRS:K:V:", k, v);
                return `${k}="${v}"`;
            }).join(' ');
        }
        res += '>';
        return res;
    }
}


function tokenize_html(html, options) {
    const tokens = [];
    let pos = 0;
    const tagre = /(<.*?>)/imsg;
    let m, txt, tag;
    while ((m = tagre.exec(html)) !== null) {
        txt = html.slice(pos, m.index).trim();
        if (txt) tokens.push({kind: 'text', token: txt});
        tag = HtmlTag.create(html.slice(m.index, tagre.lastIndex), options);
        tokens.push({kind: tag.kind, token: tag});
        pos = tagre.lastIndex;
    }
    if (pos < html.length) tokens.push({kind: 'text', token: html.slice(pos).trim()});
    return tokens;
}


export default function utidy(html, options) {
    if (options == null) options = {};
    let level, indent;
    if (options.level == null) level = 0;
    if (options.indent == null) indent = '    ';
    const _indent = function (n) {
        let res = '';
        for (let j = 0; j < Math.max(0, n); j++) {
            res += indent;
        }
        return res;
    };

    const tokens = tokenize_html(html.trim(), options);
    const res = [];
    let i = level;
    tokens.forEach(tk => {
        switch (tk.kind) {
            case 'text':
                // console.debug("TEXT:", tk.token);
                res.push(_indent(i) + tk.token);
                break;
            case 'tag-start':
                // console.debug("TAGSTART:", tk.token);
                res.push(_indent(i++) + tk.token);
                break;
            case 'tag-end':
                // console.debug("TAGEND:", tk.token);
                res.push(_indent(--i) + tk.token);
                break;
            case 'tag':
                // console.debug("TAG:", tk.token);
                res.push(_indent(i) + tk.token);
                break;
        }
    });
    return res.join('\n');
}
