
// var dk = require('../../boot/boot');
var _datatypes = require('./dk-datatypes.js')._datatypes;


/*
 *  JSON handling of complex data types.
 */
module.exports = {
    parse: function (s) {
        return JSON.parse(s, function (key, val) {
            if (typeof val === 'string' && val[0] === '@') {
                var colonpos = val.indexOf(':');
                if (colonpos > 1) {
                    var tag = val.slice(0, colonpos + 1);
                    if (!_datatypes[tag]) {
                        dk.warn("Uknown tag:", tag, "in value", val);
                        // dk.info("tags:", _datatypes);
                        return val;
                    }
                    return _datatypes[tag].create(val);
                }
            }
            return val;
        });
    },
    stringify: function (val) {
        return JSON.stringify(val);
    },
    postparse: function (jsonval) {
        return this.parse(JSON.stringify(jsonval));
    }
};
