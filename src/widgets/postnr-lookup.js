
/*
 *  Usage::
 *      PostnrLookupWidget.create_on('#my-form', {
 *          postcode_id: '#id_postcode',
 *          city_id: '#id_city'
 *      });
 */
import {Widget} from "../widgetcore/dk-widget";

export class PostnrLookupWidget extends Widget {
    constructor(...args) {
        super({
            // type: 'postnr-lookup-widget',

            // XXX: move into constructor?
            zipcode: null,  // url paramter
            postcode_id: null,
            city_id: null,

            url: '//cache.norsktest.no/ajax/poststed/<%= zipcode %>/',
            urldata: {
                zipcode: function () { return this.zipcode || undefined; }
            },
        }, ...args);
    }

    construct() {
        this.postnr = this.widget(this.postcode_id);
        this.poststed = this.widget(this.city_id);
        this.poststed.attr('tabindex', 7);
        this.zipcode = this.postnr.val();
    }

    draw(poststed) {
        this.poststed.val(poststed || '');
    }

    handlers() {
        const self = this;

        self.postnr.blur(function () {
            self.zipcode = self.postnr.val();
            self.refresh();
        });
    }
}
