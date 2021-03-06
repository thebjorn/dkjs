
//
// export function dk_encode(v) {
//     const res = [];
//     Object.entries(v).forEach(([k, v]) => {
//         let val = v;
//         if (!(typeof v === 'string' || typeof v === 'number')) {
//             v = JSON.stringify(v)
//                 .replace('{', '(')
//                 .replace('}', ')')
//                 .replace(':', '-')
//                 .replace(/"/g, "'");
//         }
//         res.push(`${k}-${v}`);
//     });
//     return res.join('~');
// }
//
// export function dk_decode(v) {
//     const items = v.split(';');
//     const entries = items.map(x => x.split('='));
//     const res = {};
//     entries.forEach(([k, v]) => {
//        
//     });
//     return res;
// }

/**
 * Returns a base64 encoded version of the JSON.stringified representation of val.
 *
 * This handles cases where val contains unicode values > 0xFF which btoa otherwise
 * would'nt be able to handle.
 *
 * @param val
 * @returns {string}
 */
export function encode_url_value(val) {
    return btoa(unescape(encodeURIComponent(JSON.stringify(val))));
    // return encodeURIComponent(JSON.stringify(val));
}

/**
 * Decodes values encoded by encode_url_value (above).
 *
 * @param val
 * @returns {any}
 */
export function decode_url_value(val) {
    try {
        return JSON.parse(decodeURIComponent(escape(atob(val))));
        // return JSON.parse(decodeURIComponent(val));
    } catch (e) {
        // console.error(`VALUE: [${val}] (${typeof val})`);
        throw e;
    }
}


export const base64_serializer = {
    encode: encode_url_value,
    decode: decode_url_value
};

export const json_serializer = {
    encode: JSON.stringify,
    decode: JSON.parse
};

export const uri_serializer = {
    encode(v) { console.log("encoding", v); return encodeURIComponent(JSON.stringify(v)); },
    decode(v) { console.log("decoding", v); return JSON.parse(decodeURIComponent(v)); }
};
