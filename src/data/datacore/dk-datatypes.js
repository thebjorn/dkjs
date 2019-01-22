
/*
 *  These data types contain functionality to serialize complex data over JSON.
 */

var _ = require('lodash');
var dk = require('../../boot/boot');
var format = require('./dk-format.js').format;

var _datatypes = {};


var datatype = dk.Class.extend({
    _value: undefined,
    ctor: function () {
        var self = this;
        Object.defineProperty(this, 'value', {
            enumerable: true,
            get: function () {
                return self._value;
            },
            set: function (v) {
                self._value = v;
                return  v;
            }
        });
    }
});

datatype.extend = function (props) {
    var SubClass = dk.Class.extend.call(this, props);
    _datatypes[SubClass.tag] = SubClass;
    SubClass.extend = this.extend;
    return SubClass;
};

var DkDate = datatype.extend({
    classattrs: {
        tag: '@date:'
    },
    ctor: function (v) {
        this._super();
        if (typeof v === 'string' && v.startsWith(this.__class__.tag)) {
            this.value = new Date(v.substr(this.__class__.tag.length));
        } else {
            this.value = dk.ctor_apply(Date, arguments);
        }
    },
    toString: function (fmt) {
        var self = this;
        if (!fmt) return this.value.toISOString().slice(0, 10);
        var res = '';
        _.toArray(fmt).forEach(function (ch) {
            switch (ch) {
                case 'Y': res += self.value.getFullYear(); break;
                case 'y': res += (self.value.getFullYear()%100); break;
                case 'n': res += self.value.getMonth() + 1; break;
                case 'm': res += format.twodigits(self.value.getMonth() + 1); break;
                case 'j': res += self.value.getDate(); break;
                case 'd': res += format.twodigits(self.value.getDate()); break;
                default: res += ch; break;
            }
        });
        return res;
    },
    toJSON: function () {
        // dk.debug('date tag', dk.Date.tag);
        return this.__class__.tag + this.value.toISOString().slice(0, 10);
    }
});


var DateTime = datatype.extend({
    classattrs: {
        tag: '@datetime:'
    },
    ctor: function (v) {
        // '2014-03-11T08:18:07.543000'
        this._super();
        if (typeof v === 'string' && v.startsWith(this.__class__.tag)) {
            this.value = this.parseISOstring(v);
        } else {
            this.value = dk.ctor_apply(Date, arguments);
        }
    },
    parseISOstring: function (s) {
        try {
            // '@datetime:2014-03-11T08:18:07.543000+00:00'
            return new Date(s.slice("@datetime:".length));
        } catch (e) {
            dk.error('Cannot parse: ' + s);
            throw(e);
        }
    },
    toString: function (fmt) {
        var self = this;
        if (!fmt) fmt = 'Y-m-d H:i:s';
        var res = '';
        _.toArray(fmt).forEach(function (ch) {
            switch (ch) {
                case 'Y': res += self.value.getFullYear(); break;
                case 'y': res += (self.value.getFullYear()%100); break;
                case 'n': res += self.value.getMonth() + 1; break;
                case 'm': res += format.twodigits(self.value.getMonth() + 1); break;
                case 'j': res += self.value.getDate(); break;
                case 'd': res += format.twodigits(self.value.getDate()); break;
                case 's': res += format.twodigits(self.value.getSeconds()); break;
                case 'i': res += format.twodigits(self.value.getMinutes()); break;
                case 'G': res += self.value.getHours(); break;
                case 'H': res += format.twodigits(self.value.getHours()); break;
                case 'g': res += self.value.getHours()%12; break;
                case 'h': res += format.twodigits(self.value.getHours()%12); break;
                case 'a': res += self.value.getHours()%12 < 12 ? 'a.m.' : 'p.m.'; break;
                case 'A': res += self.value.getHours()%12 < 12? 'A.M.': 'P.M.'; break;
                default: res += ch; break;
            }
        });
        return res;
    },
    toJSON: function () {
        return this.__class__.tag + this.value.toISOString();
    }
});


var Duration = datatype.extend({
    classattrs: {
        tag: '@duration:'
    },
    ctor: function (v) {
        this._super();
        if (v instanceof dk.Duration) {
            this.value = v.value;
            return;
        }
        if (typeof v === 'number') {
            this.value = v;
            return;
        }
        if (typeof v === 'string' && v.startsWith(dk.Duration.tag)) {
            this.value = parseInt(v.substr(dk.Duration.tag.length), 10);
            return;
        }
        this.parse(v);
    },
    /*
     *  toString() formats as 3:14:03, with an optional leading minus sign.
     */
    toString: function () {
        var seconds = this.value;
        var sign = seconds < 0 ? -1: 1;
        seconds = seconds * sign;
        var secs = seconds % 60;
        var mins = Math.floor((seconds - secs) / 60);
        var minutes = mins % 60;
        var hours = Math.floor((mins - minutes) / 60);
        return (sign < 0? '-': '') + hours + ':' + format.twodigits(minutes) + ':' + format.twodigits(secs);
    },
    parse: function (s) {
        this.value = 0;
        if (!s) return;

        var sign = 1,
            seconds,
            minutes,
            hours;

        if (s[0] === '-') {
            sign = -1;
            s = s.slice(1);
        }
        var parts = s.split(':');
        seconds = parseInt(parts.slice(-1), 10);
        minutes = parseInt(parts.slice(-2, -1), 10);  // will be NaN if string doesn't contain minutes
        hours = parseInt(parts.slice(-3, -2), 10);
        this.value += seconds;
        if (!_.isNaN(minutes)) this.value += 60 * minutes;
        if (!_.isNaN(hours)) this.value += 60 * 60 * hours;
        this.value *= sign;
    },
    toJSON: function () {
        return dk.Duration.tag + this.value;
    }
});


module.exports = {
    _datatypes: _datatypes,
    Date: DkDate,
    DateTime: DateTime,
    Duration: Duration
};
