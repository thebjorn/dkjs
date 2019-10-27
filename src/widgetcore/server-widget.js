
import jason from "../data/datacore/dk-json";
import {DataWidget} from "./data-widget";
import {dkwarning} from "../lifecycle/coldboot/dkwarning";
import {ajax} from "../browser/dk-client";
import {dkconsole} from "../lifecycle/dkboot/dk-console";

export class ServerWidget extends DataWidget {
    constructor(...args) {
        super({
            cache: false
        }, ...args);
    }

    /*
     *  Default implementation returns self, meaning that parameters coming
     *  from instance attributes, including tag parameters coming from
     *  $.init_widgets, are handled automatically.  Sub-classes should
     *  ovverride this method when they need to fill parameters that need
     *  to be calculated in some way (e.g. fetched from an input control --
     *  at least until we get ModelViews).
     *
     *  This method should return a property object that at least contains
     *  values for all url parameters.
     */
    _get_urldata() {
        dkwarning(`
                URLs with template parameters have changed. Previous syntax:

                    url: '/ajax/poststed/<%= zipcode %>/',
                    urldata: {
                        zipcode: function () { return this.zipcode || undefined; }
                    },

                new syntax (without the backslashes before the back-ticks, which are needed
                here since we're inside a big back-tick block):

                    url() {return \`/ajax/poststed/${this.zipcode || undefined}/\`; }

            `);
        return {};
        
        // const res = {};
        // if (!this.urldata) return res;
        // if (typeof this.urldata === 'function') {
        //     return this.urldata();
        // } else {
        //     for (const attr in this.urldata) {
        //         //noinspection JSUnfilteredForInLoop
        //         const val = this.urldata[attr];
        //         //noinspection JSUnfilteredForInLoop
        //         res[attr] = (typeof val === 'function') ? val.call(this) : val;
        //         //noinspection JSUnfilteredForInLoop
        //         if (res[attr] === undefined) throw attr;
        //     }
        //     return res;
        // }
    }

    /*
     *  Generates the url for this widget, and calls fetch_json_data to fetch
     *  data from this url.  Automatically prevents a second refresh from starting
     *  while the first one is still going.
     */
    // refresh() {
    //     let url;
    //     if (this.waiting || !this.url) return;
    //     if (this._url_is_template()) {
    //         try {
    //             // const urldata = this._get_urldata();
    //             // url = template(this.url, urldata);
    //             url = this.url();
    //         } catch (err) {
    //             this.draw(null);
    //             return;
    //         }
    //     } else {
    //         url = this.url;
    //     }
    //     this.fetch_json_data(url);
    // }
    
    _url_is_template() {
        if (typeof this.url === "function") return true;

        if (this.url.indexOf('<%') !== -1 && this.url.indexOf('%>') !== -1) {
            dkwarning(`
                URLs with template parameters have changed. Previous syntax:

                    url: '/ajax/poststed/<%= zipcode %>/',
                    urldata: {
                        zipcode: function () { return this.zipcode || undefined; }
                    },

                new syntax (without the backslashes before the back-ticks, which are needed
                here since we're inside a big back-tick block):

                    url() {return \`/ajax/poststed/${this.zipcode || undefined}/\`; }

            `);
            throw "found old-style url-template";
        }
        return false;
    }

    widget_url() {
        if (this.waiting || !this.url) return;
        if (this._url_is_template()) {
            try {
                // const urldata = this._get_urldata();
                // url = template(this.url, urldata);
                return this.url();
            } catch (err) {
                this.draw(null);
                return null;
            }
        } else {
            return this.url;
        }
    }
    //
    // /*
    //  *  Generates the url for this widget, and calls fetch_json_data to fetch
    //  *  data from this url.  Automatically prevents a second refresh from starting
    //  *  while the first one is still going.
    //  */
    refresh() {
        const url = this.widget_url();
        if (url) {
            this.fetch_json_data(url);
        }
    }

    /*
     *  The fundamental method for fetching json formatted data from
     *  ``url``.
     *
     *  It signals
     *
     *     `start-fetch-data` before starting, and
     *     `fetch-data` upon success
     *
     *  Upon success, self.data is set to the received data, and .draw(data)
     *  is called.
     */
    fetch_json_data(url) {
        const self = this;
        this.waiting = true;
        this.trigger('start-fetch-data', self);

        this.server_widget_call_ajax({
            cache: self.cache,
            dataType: /^https?:\/\//.test(url) ? 'jsonp' : 'json',
            url: url,
            statusCode: {
                404: function () {
                    dkconsole.debug("Page not found: " + url);
                },
                500: function () {
                    // display the server error to the user.
                    window.open(url);
                    //document.location = url;
                }
            },
            error(req, status, err) {
                self.waiting = false;
                dkconsole.warn("ERROR", req, status, err);
                self.trigger('fetch-data-error', req, status, err);
                throw {error: "fetch-error", message: status + ' ' + err};
            },
            converters: {
                "text json": jason.parse
            },
            success(data) {
                self.data = data;
                self.waiting = false;
                self.trigger("fetch-data", self);
                self.draw(data);
            }
        });
    }

    /**
     * Extracted to make testing easier.
     * 
     * @param params
     * @private
     */
    server_widget_call_ajax(params) {
        ajax(params);
    }
}
