
var format = {
    twodigits: function (n) { return (n < 10? '0': '') + n; },
    value: function (val, record, cell) {
        if (val === null) return "";
        //if (typeof val === "undefined") debugger;
        var v;
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
    },
    percent: function (val) {
        if (val === null) return "";
        return val + "%";
    },
    bool: function (trueval, falseval) {
        return function (val) {
            if (!!val) return trueval;
            return falseval;
        };
    },
    no_date: function (val) {
        if (!val) return "";
        var v = val.value;
        return '%02d.%02d.%04d'.format(v.getDate(), v.getMonth() + 1, v.getFullYear());
    },
    no_datetime: function (val) {
        if (!val) return "";
        var v = val.value;
        return '%02d.%02d.%04d kl.%02d.%02d:%02d'.format(
            v.getDate(), v.getMonth() + 1, v.getFullYear(),
            v.getHours(), v.getMinutes(), v.getSeconds()
        );
    }
};

module.exports = {
    format: format,

    /*
     *  Convert val to string, based on its implied type.
     *  (keep as separate top level function so there aren't any proxy issues
     *  when using dk.format.value as a parameter).
     */
    format_value: function (val, record, cell) {
        return format.value(val, record, cell);
    }
};
