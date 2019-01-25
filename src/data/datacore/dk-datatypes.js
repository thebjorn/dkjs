
/*
 *  These data types contain functionality to serialize complex data over JSON.
 */

// var dk = require('../../boot/boot');
import _ from 'lodash';
import format from "./dk-format";
import Class from "../../lifecycle/coldboot/dk-class";

const _datatypes = {};


export class datatype extends Class {
    constructor() {
        super();
        this._value = undefined;
    }
    _has_my_tag(args) {
        return (args.length > 0 && 
                typeof args[0] === 'string' && 
                args[0].startsWith(this.tag));
    }
    static get_datatypes() { return _datatypes; }
    static extend(props) {
        const SubClass = super.extend(props);
        _datatypes[SubClass.tag] = SubClass;
        // SubClass.extend = this.extend;
        return SubClass;
    }
    get tag() { return this.constructor.tag; }
    
    get value() { return this._value; }
    set value(v) {
        this._value = v;
        return v;
    }
}


export function dkdatatype({tag}) {
    return function decorator(cls) {
        if (cls.kind !== 'class') throw `not class ${cls.kind}`;
        Object.entries({tag}).forEach(([k, v]) => {
            cls.elements.push({
                kind: 'field',
                key: k,
                placement: 'static', 
                descriptor: {
                    configurable: false,
                    enumerable: true,
                    writable: false
                },
                initializer: () => v
            });
        });
        return {
            kind: 'class',
            elements: cls.elements
        };
    };
}


@dkdatatype({tag: '@date:'})
export class DkDate extends datatype {
    constructor(...args) {
        super();
        if (this._has_my_tag(args)) {
            this.value = new Date(args[0].substr(this.tag.length));
        } else {
            let [y, m, d] = [...args];
            this.value = new Date(y, m, d);
            // this.value = new Date(y, m-1, d);
        }
    }
    toString(fmt) {
        // if (!fmt) return this.value.toISOString();
        if (!fmt) fmt = 'Y-m-d';
        let res = '';
        _.toArray(fmt).forEach((ch) => {
            switch (ch) {
                case 'Y': res += this.value.getFullYear(); break;
                case 'y': res += (this.value.getFullYear()%100); break;
                case 'n': res += this.value.getMonth() + 1; break;
                case 'm': res += format.twodigits(this.value.getMonth() + 1); break;
                case 'j': res += this.value.getDate(); break;
                case 'd': res += format.twodigits(this.value.getDate()); break;
                default: res += ch; break;
            }
        });
        return res;
    }
    toJSON() {
        // dk.debug('date tag', dk.Date.tag);
        return this.tag + this.value.toISOString().slice(0, 10);
    }
}
_datatypes[DkDate.tag] = DkDate;


@dkdatatype({tag: '@datetime:'})
export class DateTime extends datatype {
    constructor(...args) {
        // '2014-03-11T08:18:07.543000'
        super();
        if (this._has_my_tag(args)) {
            this.value = this.parseISOstring(args[0]);
        } else {
            this.value = new Date(...args);
        }
    }
    parseISOstring(s) {
        try {
            // '@datetime:2014-03-11T08:18:07.543000+00:00'
            return new Date(s.slice(this.tag.length));
        } catch (e) {
            dk.error('Cannot parse: ' + s);     // FIXME: need to import dk...
            throw(e);
        }
    }
    toString(fmt) {
        if (!fmt) fmt = 'Y-m-d H:i:s';
        let res = '';
        _.toArray(fmt).forEach(function (ch) {
            switch (ch) {
                case 'Y': res += this.value.getFullYear(); break;
                case 'y': res += (this.value.getFullYear()%100); break;
                case 'n': res += this.value.getMonth() + 1; break;
                case 'm': res += format.twodigits(this.value.getMonth() + 1); break;
                case 'j': res += this.value.getDate(); break;
                case 'd': res += format.twodigits(this.value.getDate()); break;
                case 's': res += format.twodigits(this.value.getSeconds()); break;
                case 'i': res += format.twodigits(this.value.getMinutes()); break;
                case 'G': res += this.value.getHours(); break;
                case 'H': res += format.twodigits(this.value.getHours()); break;
                case 'g': res += this.value.getHours()%12; break;
                case 'h': res += format.twodigits(this.value.getHours()%12); break;
                case 'a': res += this.value.getHours()%12 < 12 ? 'a.m.' : 'p.m.'; break;
                case 'A': res += this.value.getHours()%12 < 12? 'A.M.': 'P.M.'; break;
                default: res += ch; break;
            }
        });
        return res;
    }
    toJSON() {
        return this.tag + this.value.toISOString();
    }
}
_datatypes[DateTime.tag] = DkDate;


@dkdatatype({tag: '@duration:'})
export class Duration extends datatype {
    constructor(v) {
        super();
        if (v instanceof Duration) {
            this.value = v.value;
            return;
        }
        if (typeof v === 'number') {
            this.value = v;
            return;
        }
        if (this._has_my_tag([v])) {
            this.value = parseInt(v.substr(this.tag.length), 10);
            return;
        }
        this.parse(v);
    }
    /*
     *  toString() formats as 3:14:03, with an optional leading minus sign.
     */
    toString() {
        let seconds = this.value;
        const sign = seconds < 0 ? -1: 1;
        seconds = seconds * sign;
        const secs = seconds % 60;
        const mins = Math.floor((seconds - secs) / 60);
        const minutes = mins % 60;
        const hours = Math.floor((mins - minutes) / 60);
        return (sign < 0? '-': '') + hours + ':' + format.twodigits(minutes) + ':' + format.twodigits(secs);
    }
    parse(s) {
        this.value = 0;
        if (!s) return;

        let sign = 1,
            seconds,
            minutes,
            hours;

        if (s[0] === '-') {
            sign = -1;
            s = s.slice(1);
        }
        const parts = s.split(':');
        seconds = parseInt(parts.slice(-1), 10);
        minutes = parseInt(parts.slice(-2, -1), 10);  // will be NaN if string doesn't contain minutes
        hours = parseInt(parts.slice(-3, -2), 10);
        this.value += seconds;
        if (!_.isNaN(minutes)) this.value += 60 * minutes;
        if (!_.isNaN(hours)) this.value += 60 * 60 * hours;
        this.value *= sign;
    }
    toJSON() {
        return this.tag + this.value;
    }
}
_datatypes[Duration.tag] = Duration;


export default {
    _datatypes: _datatypes,
    Date: DkDate,
    DateTime: DateTime,
    Duration: Duration
};
