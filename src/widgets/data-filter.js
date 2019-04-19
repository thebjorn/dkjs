

/*
 *   This is the top-level filter widget, which groups all sub-filters
 *   for a given data table/grid.
 */

import dk from "../dk-obj";
// import {Widget} from "../widgetcore/dk-widget";
// import {Template} from "../browser/dk-dom-template";
import {CheckboxSelectWidget, RadioSelectWidget, TriboolWidget} from "../forms/widgets";
import {zip_object} from "../collections";
import {UIWidget} from "../widgetcore/ui-widget";
import is from "../is";
import {dkconsole} from "../lifecycle/dkboot/dk-console";


// export function list2data(lst) {
//     if (Array.isArray(lst)) {
//         const res = {};
//         lst.forEach(item => {
//             if (typeof item === 'number') {
//                 res[`0${item}`] = item; // make key a string wrt. order
//             } else {
//                 res[item] = item;
//             }
//         });
//         // res.__order = lst;      // XXX: Not needed anymore
//         return res;
//     } else {
//         return lst;
//     }
// }

/**
 * A single filter definition.
 * Think of it as a filter for a single field.
 * Multiple filter definitions will normally make up the filter for a datasource.
 */
export class FilterDefBase extends UIWidget {
    constructor(...args) {
        super({
            select_multiple: false,
            name: null,
            label: "",
            values: null,
            structure: {
                filterbox: {
                    classes: [],
                    filterheader: {
                        template: 'header',
                        filtertitle: {
                            template: 'h4',
                            text: ""
                        }
                    },
                    filtercontent: {
                        classes: ['filter', 'content']
                    }
                }
            }
        }, ...args);
        
        this.structure.filterbox.classes.push(this.name);
        this.structure.filterbox.filterheader.filtertitle.text = this.label || this.name;
    }
    
    get value() {
        return this.input ? this.input.value : {};  // should be this.widget, but clashes with dk.UIWidget.widget()
    }
}

/**
 * Filters can construct their own UI, using the construct method,
 * which takes a location. When generating the UI you must:
 *
 *  - create a `this.widget` property (the filter system listens for
 *    notifications on this widget.
 *  - set `this.value` to the correct filter value (this can be a
 *    compound value, but must be _JSON_ serializable).
 *  - call `dk.publish(this.widget, 'change', this.widget)` whenever
 *    the filter value changes.
 */
export class CustomFilterDef extends FilterDefBase {}


export class SelectOneFilterDef extends FilterDefBase {
    constructor(...args) {
        super({
            select_multiple: false
        }, ...args);
    }
    
    construct() {
        this.input = RadioSelectWidget.create_on(this.filterbox.filtercontent, {
            options: this.values,
            name: this.name,
            label: this.label
        });
    }
}


export class SelectMultipleFilterDef extends SelectOneFilterDef {
    constructor(...args) {
        super({
            select_multiple: true
        }, ...args);
    }

    construct() {
        this.input = CheckboxSelectWidget.create_on(this.filterbox.filtercontent, {
            options: this.values,
            name: this.name,
            label: this.label
        });
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
export class DataFilter extends UIWidget {
    constructor(...args) {
        super({
            // type: 'DataFilter',
            data: undefined,
            heading: 'Filter',
            filters: {},
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
        
        // FIXME: convert this.filters to list of FilterDefBase subclasses
        this._filters = Object.entries(this.filters).map(([filtername, filterdef]) => {
            /* filterdef is either
                 
                 (a) { select_multiple: true, values: .., ... }
                 (b) { construct(location) {}, ... }
                 (c) { values: .., ... }
                
               For option (b), the object must 
               
                 (i) create a `this.widget` property (the filter system listens
                     for notifications on this widget.
                (ii) set `this.value` to the correct filter value (this can be a
                     compound value, but must be _JSON_ serializable).
               (iii) call `dk.trigger(this.widget, 'change', this.widget)` whenever
                     the filter value changes.
                     
             */
            filterdef.name = filtername;
            if (is.isProps(filterdef)) {
                if (filterdef.select_multiple) {  // (a)
                    return [filterdef, SelectMultipleFilterDef];
                } else if (filterdef.construct) {  // (b)
                    return [filterdef, CustomFilterDef];
                } else {
                    return [filterdef, SelectOneFilterDef];
                }
            } else {
                dkconsole.warn("filter def is not a properties object..?");
                // return [filterdef, null]; 
            }
        });
    }

    /*
     *  construct_filterbx is called for each filter definition in this.filters
     *  and creates the radio/check boxes for the filters, calls the data-set
     *  to fetch all filter values, etc.
     */
    // construct_filterbx(location, filterdef, filter_name) {
    //     const self = this;
    //     // const structure = {
    //     //     filterbox: {
    //     //         classes: [filter_name],
    //     //         filterheader: {
    //     //             filtertitle: {
    //     //                 text: filterdef.label || filter_name
    //     //             }
    //     //         },
    //     //         filtercontent: {}
    //     //     }
    //     // };
    //     // const templ = new Template(structure, this.template);
    //     // const dom = templ.append_to(location, this, location);
    //
    //     if (!filterdef.construct) {
    //         // Filters that don't construct themselves are constructed either as single or
    //         // multiple selects. Default is single-selection (i.e. radio selects).
    //         // Note: these should be the only defaults! (filter types that DataFilter knows about)
    //         let FilterDef = filterdef.select_multiple ? SelectMultipleFilterDef : SelectOneFilterDef;
    //         filterdef = FilterDef.append_to(location, filterdef); // FIXME HERE!!
    //        
    //         // filterdef.construct = function (loc) {
    //         //     // this here refers to the filter, which we are attaching a new method to..
    //         //     const me = this;
    //         //
    //         //     // noinspection JSPotentiallyInvalidUsageOfClassThis
    //         //     this.widget = widgetclass.create_inside(loc, {
    //         //         data: {value: list2data(this.values)},
    //         //         name: filter_name,
    //         //         label: me.label
    //         //     });
    //         //
    //         //     if (!this.widget.data) {
    //         //         self.dataset.get_filter_data(filter_name, this.widget.FN('draw'));
    //         //     }
    //         // };
    //     } else {
    //         filterdef.construct(location.filterbox.filtercontent);
    //     }
    //     if (filterdef.widget) {
    //         // filters with their own `construct()` don't necessarily have `.input`
    //         dk.on(filterdef.widget, 'change').run(function () {
    //             dk.debug('filter-change', self.values());
    //             if (self.data) self.data.set_filter(self.values());
    //             dk.trigger(self, 'filter-change', self.values());
    //         });
    //     }
    //     // return dom;
    // }

    construct() {
        this._filter_objects = this._filters.map(([filterprops, filtercls]) => {
            const res = filtercls.append_to(this.content, filterprops);
            dk.on(res, 'change', () => {
                if (this.data) this.data.set_filter(this.values());
                this.trigger('filter-change', this.values());
            });
            return res;
        });
        // Object.entries(this.filters).forEach(([key, value]) => {
        //     //console.log('key:', key, 'value:', value);
        //     this.construct_filterbx(this.content, value, key);
        // });
    }

    values() {
        const self = this;
        const keys = Object.keys(this.filters);
        const vals = keys.map(filter_name => {
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
