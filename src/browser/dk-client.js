
import dk from "../dk-obj";
import cookie from "./dk-cookie";
import jason from "../data/datacore/dk-json";


/*
 *  A csrf-aware ajax call.
 */
function _make_global_ajax_params(params) {
    const self = this;
    const csrf_safe = function (method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    };
    const beforeSend = params.beforeSend;
    params.beforeSend = function (xhr, settings) {
        xhr.setRequestHeader("X-dkjs", dk.version);
        if (!csrf_safe(params.type)) {
            xhr.setRequestHeader("X-CSRFToken", cookie.get('csrftoken'));
        }
        if (beforeSend) {
            beforeSend.call(self, xhr, settings);
        }
    };

    if (!csrf_safe(params.type)) {
        //params.crossDomain = false;
    }
    if (params.data && typeof params.data !== 'string') {
        params.data = JSON.stringify(params.data);
        params.dataType = 'json';
        params.contentType = 'application/json; charset=utf-8';
    }
    return params;    
}
export function ajax(params) {
    return dk.$.ajax(_make_global_ajax_params(params));
}
export async function async_ajax(params) {
    return await dk.$.ajax(_make_global_ajax_params(params));
} 

/*
 *  A better behaved ajax.
 *
 */
function _make_global_json_params(params) {
    params = dk.$.extend({
        cache: false,
        dataType: 'json',
        statusCode: {
            404: function () { alert("Page not found: " + params.url); },
            409: function (xhr, textStatus, error) {  // rate limiting error
                dk.log(409, xhr, textStatus, error);
                //alert(error);
            },
            500: function () {
                // display the server error to the user.
                if (!params.stop_500_redirect) {
                    document.location = params.url;
                }
            }
        },
        error: function (req, status, err) {
            dk.log("ERROR", req, status, err);
            document.location = params.url;
            //throw {error: "fetch-error", message: status + ' ' + err};
        },
        converters: {
            "text json": jason.parse
        },
        success: function () {
            // dk.log("SUCCESS:", data);
        }
    }, params);
    if (params.data) {
        params.type = 'POST';
    }
    return params;
}
export function json(params) {
    return ajax(_make_global_json_params(params));
}
export async function async_json(params) {
    return await async_ajax(_make_global_json_params(params));
}
