/*
    Default layout::

        <form class="search-form form-inline" role="form">
            <div class="input-group input-sm">
                <input accesskey="s" name="q" class="form-control" placeholder="Søk.." type="search">
                <span class="input-group-btn">
                    <button class="btn btn-default">
                        <i class="fa fa-times"></i>
                    </button>
                    <button class="btn btn-primary">
                        <i class="fa fa-search"></i>
                    </button>
                </span>
            </div>
        </form>

 */

import dk from "../dk-obj";
import {Widget} from "../widgetcore/dk-widget";
import {icon} from "./dk-icon-library";


export class SearchWidget extends Widget {
    constructor(...args) {
        super({
            // type: 'search',
            classes: ['search-form', 'form-inline'],
            accesskey: 's',
            name: 'q',
            tabindex: undefined,
            search_text: 'Søk',
            go_button_text: icon('search:fw'),
            clear_button_text: icon('times:fw'),

            structure: {
                form_group: {
                    input_group: {
                        search_input: {},
                        clear_button: {},
                        go_group: {
                            go_button: {
                                template: '<button class="go-button btn btn-primary"/>'
                            }
                        }
                    }
                }
            },

            template: {
                root: 'form',
                form_group: '<div class="form-group has-feedback"/>',
                input_group: '<div class="input-group input-group-sm"/>',
                search_input: '<input type="search" class="form-control"/>',
                go_group: '<div class="input-group-btn"/>',
                //go_button: '<button class="go-button btn btn-primary"/>',
                clear_button: '<span class="clear-button form-control-feedback"/>'
            },
            
        }, ...args);
        this._lastval = null;
    }

    construct() {
        const input_group = this.form_group.input_group;

        this.clear_button = input_group.clear_button;
        this.clear_button.append(this.clear_button_text);

        this.go_button = input_group.go_group.go_button;
        this.go_button.append(this.go_button_text);

        this.input = input_group.search_input;
        this.input.attr({
            accesskey: this.accesskey,
            name: this.name,
            tabindex: this.tabindex,
            placeholder: this.search_text + '..'
        });

        this.clear_button.hide();
    }

    // XXX: this widget currently stores state data in a DOM property... 
    get_state() {
        return this.get_value();
    }

    set_state(s) {
        this.set_value(s);
    }

    set_value(v) {
        this.input.val(v);
    }

    get_value() {
        return this.input.val();
    }

    handlers() {
        const self = this;

        const search = function (e) {
            e.stopPropagation();
            if (self._searching) return false;
            self._searching = true;
            dk.trigger(self, 'search', self.get_value());
            self._searching = false;
            return false;
        };

        this.widget('.search-form').on('submit', search);

        this.widget().on('click', '.clear-button', function (e) {
            e.stopPropagation();
            self.set_value("");
            self.trigger("clear");
        });

        this.widget().on('click', '.go-button', search);

        this.input.on('keypress', function (e) {
            if (e.which === 13) {
                return search(e);
            }
        });

        this.input.on('keyup', function () {
            const val = self.input.val();
            if (self._lastval === val) return;
            self._lastval = val;
            if (val === "") {
                self.clear_button.hide();
            } else {
                self.clear_button.show();
            }
            self.trigger("change", val);
        });
    }
}
