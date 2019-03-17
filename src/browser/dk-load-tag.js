/**
 *  dk-load is a tag the asynchronously loads content (using jQuery.load)
 *
 *      <dk-load url="..."     -- url to fetch
 *               data="..."    -- (optional) data to to send when fetching
 *               select=".."   -- (optional) selector applied before inserting content
 *               delay="nnn"   -- (optional) milliseconds to wait before loading
 *               nofetch       -- (optional) prevents auto-fetch
 *               >
 *          before-load-content
 *      </dk-load>
 *
 *  If the `delay` attribute is present, dkjs will wait before loading the url.
 *
 *  To load just a part of the url source, use:
 *
 *      <dk-load url="/my/url" select="#selector" ...>
 *
 *   During the fetching of the resource 'dk-loading' is triggered every 500 ms.
 *
 *   To prevent automatic fetching of the document, just add the nofetch attribute.
 *   You must then manually call .fetch():
 *
 *      <dk-load id="my-url" url='my/url" nofetch>
 *          <button onclick="document.getElementById('my-url').fetch();">
 *              load..
 *          </button>
 *      </dk-load>
 *
 */

import dk from "../dk-obj";


if (typeof customElements !== 'undefined') customElements.define('dk-load', class extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        if (!this.nofetch) {
            // always use setTimeout to clear the work-queue before loading
            setTimeout(() => this.fetch(), this.delay);
        }
    }

    fetch() {
        const self = this;
        const url = this.url + (this.select ? " " + this.select : "");

        const loading_timer = setInterval(() => {
            dk.$(this).trigger('dk-loading', this);
        }, 500);

        try {
            dk.$(this).load(url, this.data, () => {
                clearInterval(loading_timer);
                dk.trigger(this, 'dk-loaded', this);
                dk.$(this).trigger('dk-loaded', this);
            });
        } catch (e) {
            dk.$(this).trigger('dk-loading-error', this);
        }
    }
    
    static get observedAttirbutes() {
        return [
            'url', 'data', 'select', 'delay', 'nofetch'
        ];
    }
    get url() { return this.getAttribute("url"); }
    set url(val) { this.setAttribute("url", val); }
    
    get data() { return this.getAttribute("data"); }
    set data(val) { this.setAttribute("data", val); }
    
    get select() { return this.getAttribute("select"); }
    set select(val) { this.setAttribute("select", val); }
    
    get delay() { return parseInt(this.getAttribute("delay") || "0", 10); }
    set delay(val) { this.setAttribute("delay", val); }
    
    get nofetch() { return this.getAttribute("nofetch"); }
    set nofetch(val) { this.setAttribute("nofetch", val); }
});
