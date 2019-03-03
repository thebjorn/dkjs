

/*
 *   This is the top-level filter widget, which groups all sub-filters
 *   for a given data table/grid.
 */
// const _ = require('lodash');
// const dk = require('../boot');
// const Widget = require('../widgetcore/dk-widget.js');
// const forms = require('../forms');

import dk from "../dk-obj";
import {Widget} from "../widgetcore/dk-widget";
import {Template} from "../browser/dk-dom-template";
import {CheckboxSelectWidget, RadioSelectWidget, TriboolWidget} from "../forms/widgets";
import {zip_object} from "../collections";


export function list2data (lst) {
    if (Array.isArray(lst)) {
        const res = {};
        lst.forEach(function (item) {
            res[item] = item;
        });
        res.__order = lst;      // XXX: Not needed anymore
        return res;
    } else {
        return lst;
    }
}


/*
 *  The top level filter container/widget.
 *
 *  dk.filter.DataFilter.create_on(filterbox, {
 *      ...
 *      filters: {
 *          testleader: {
 *              label: 'Testleder',
 *              select_multiple: true,
 *              url: 'progress/all!get-testleader-values'
 *          },
 *          favyear: {
 *              label: 'Favorittår',
 *              values: [2013, 2014, 2015, 2016],
 *              select_multiple: true
 *          },
 *          smile: {
 *              label: 'Smil',
 *              value: undefined,
 *              construct(location) {
 *                  const self = this;
 *                  const btn = $('<button/>').text(":-)");
 *                  this.widget = location.append(btn);
 *                  $(this.widget).on('click', function () {
 *                      self.value = "*SMILE*";
 *                      dk.publish(self.widget, 'change', self.widget);
 *                  });
 *              }
 *          }
 *      }
 *  });
 */
export class DataFilter extends Widget {
    constructor(...args) {
        super({
            // type: 'DataFilter',
            data: undefined,
            heading: 'Filter',
            filters: [],         // XXX shouldn't this be {} or null?
            dataset: null,
            structure: {
                header: {
                    title: {
                        text: 'Filter'
                    }
                },
                content: {}
            },

            template: {
                root: 'section',
                header: '<header/>',
                title: '<h2/>',
                content: '<div/>',

                // Each filter is contained in a .filterbox that is structured
                // similarly to the main filter section.
                filterbox: '<div/>',
                filterheader: '<header/>',
                filtertitle: '<h4/>',
                filtercontent: '<div class="filter content"/>'
            },
            
        }, ...args);
    }

    /*
     *  construct_filterbx is called for each filter definition in this.filters
     *  and creates the radio/check boxes for the filters, calls the data-set
     *  to fetch all filter values, etc.
     */
    construct_filterbx(location, filter, filter_name) {
        const self = this;
        const structure = {
            filterbox: {
                classes: [filter_name],
                filterheader: {
                    filtertitle: {
                        text: filter.label || filter_name
                    }
                },
                filtercontent: {}
            }
        };
        const templ = Template(structure, this.template);
        const dom = templ.append_to(location, this, location);

        if (!filter.construct) {
            // Filters that don't construct themselves are constructed either as single or
            // multiple selects. Default is single-selection (i.e. radio selects).
            let widgetclass = filter.select_multiple ? CheckboxSelectWidget : RadioSelectWidget;
            if (filter.tribool) {
                widgetclass = TriboolWidget;
            }

            filter.construct = function (loc) {
                // this here refers to the filter, which we are attaching a new method to..
                const me = this;

                // noinspection JSPotentiallyInvalidUsageOfClassThis
                this.widget = widgetclass.create_inside(loc, {
                    data: list2data(this.values),
                    name: filter_name,
                    label: me.label
                });

                if (!this.widget.data) {
                    self.dataset.get_filter_data(filter_name, this.widget.FN('draw'));
                }
            };
        }
        filter.construct(location.filterbox.filtercontent);
        if (filter.widget) {
            // filters with their own `construct()` don't necessarily have `.widget`
            dk.on(filter.widget, 'change').run(function () {
                dk.debug('filter-change', self.values());
                if (self.data) self.data.set_filter(self.values());
                dk.publish(self, 'filter-change', self.values());
            });
        }
        return dom;
    }

    construct() {
        this.filters.forEach((value, key) => {
            //console.log('key:', key, 'value:', value);
            this.construct_filterbx(this.content, value, key);
        });
    }

    values() {
        const self = this;
        const keys = Object.keys(this.filters);
        const vals = keys.map(function (filter_name) {
            const filter = self.filters[filter_name];
            if (filter.value) {
                // filter has defined a value on itself..
                return filter.value;
            }
            if (filter.widget && filter.widget.jquery) {
                // found a jQuery object, get its .val()
                return filter.widget.val();
            }
            if (filter.widget && filter.widget.value) {
                // found a dk.form object
                return filter.widget.value;
            }
        });
        // dk.dir(_.object(keys, vals));
        return zip_object(keys, vals);
    }
}
