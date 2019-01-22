

export default {

    get: function (key, options) {
        options = options || {};
        let result, decode = options.raw? function (s) { return s; }: decodeURIComponent;
        return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie))? decode(result[1]): null;
    },

    set: function (key, value, options) {
        options = options || {expires: 'Tue, 19 Jan 2038 03:14:07 GMT', path: '/'};
        // document.cookie = '%s=%s; expires=%s'.format(key, value, options.expires);
        const val = options.raw ? value : encodeURIComponent(value);
        document.cookie = `${encodeURIComponent(key)}=${val}; expires=${options.expires}; path=${options.path}`;
    }

};
