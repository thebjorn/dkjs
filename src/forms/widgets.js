
/*
 *  dk.forms namespace
 *
 *  The purpose of these widgets is to auto-create widgets for inline editing of grids.
 */

import dk from "../dk-obj";
import {Widget} from "../widgetcore/dk-widget";
import is from "../is";
import {Duration} from "../data/datacore/dk-datatypes";


export class InputWidget extends Widget {
    constructor(...args) {
        super({
            data: {
                value: null,
                // disabled: false,
                // readonly: false,
                // required: false,
                // autofocus: false,
            }
        }, ...args);
        
        this._validators = [];
        this._updating = false;
    }
    get value() {
        return this.data.value;
    }
    set value(v) {
        const value = this.parse(v);
        this.data.value = value;
        return v;
    }
    get_value() { return this.value; }
    set_value(v) { this.value = v; return v; }
    formatted_value() {
        return this.value.f || this.value;
    }
    get_field_value() {
        return this.value;
    }

    /**
     * Automatically called when Widget.data.xxx is changed
     * 
     * @param data      - the new Widget.data
     * @param path      - the path to the value being changed
     * @param val       - the new value
     * @param name      - the name of the attribute being changed (last part of path)
     * @param target    - the object (Widget.data, or Widget.data...) which is being changed
     */
    data_changed(data, path, val, name, target) {
        const v = data.value.value || data.value.v || data.value;
        switch (name) {
            case 'value':
                ++this._updating;
                this.widget().val(this.stringify(v));
                this.node.setAttribute('value', this.stringify(v));
                --this._updating;
                
                this.trigger('set-value', data.value);
                break;
            case 'readonly':  // handle mixed-case dom property
                this.node.readOnly = data.readonly;
                break;
            default:
                // console.log('data:name:', data[name]);
                this.node[name] = data[name];
        }
        super.data_changed(data, path, val, name, target);
    }

    /**
     * "Automatically" called (from handlers) when the dom has changed
     * @param change
     */
    widget_changed(event) {
        if (this._updating === 0 && event.type === 'change') {
            ++this._updating;
            this.value = this.parse(event.item.value);
            --this._updating;
        }
    }
    // // toString() helpers..
    // get _widget_data() { return this.widget().data('value'); }
    // get _widget_type() { return this.node.type; }
    // get _widget_val() { return this.widget().val(); }
    // get_widget_value() { return this.widget().val(); }

    prepare() {
        // xxx: sub-classes should call this at the start of their construct method..
        this.name = this.name || this.widget().attr('name') || dk.id2name(this.id);
        this.widget().attr('name', this.name);
        this.widget().addClass(this.type);
        if (this.css) this.widget().css(this.css);
    }
    construct() {
        this.prepare();
    }
    
    stringify(val) { return val; }
    parse(str) { return str; }

    handlers() {
        const self = this;
        this.widget().on('change', function (e) {
            self.widget_changed({
                type: 'change',
                event: e,
                item: this
            });
            self.trigger('change', e, self);
        });
        this.retrigger('validation-change');
    }
    
    toString() {
        const html = this.widget()[0].outerHTML;
        const state = JSON.stringify({
            data: this.data || null,  // undefined doesn't show up in JSON.stringify
            type: this.node.type || null,
            val: this.node.value || null
        });
        return `${html}(${state})`;
    }
}


export class TextInputWidget extends InputWidget {
    constructor(...args) {
        super({
            template: {root: 'input'}
        }, ...args);
    }
    construct() {
        super.construct();
        // this.data.type = 'text';
        this.node.setAttribute('type', 'text');
    }
    handlers() {
        super.handlers();
        this.retrigger('keyup');
    }
}


export class DurationWidget extends InputWidget {
    constructor(...args) {
        super({
            template: {root: 'input'},
        }, ...args);
    }
    parse(str) {
        if (str instanceof Duration) return str;
        return new Duration(str);
    }
    stringify(val) {
        if (val instanceof Duration) return val.toString();
        return (new Duration(val)).toString();
    }
    construct() {
        super.construct();
        this.node.setAttribute('type', 'text');
    }
}


export class RadioInputWidget extends InputWidget {
    construct() {
        super.construct();
        this.widget().prop('type', 'radio');
    }
}


export class SelectWidget extends InputWidget {
    constructor() {
        super({
            data: undefined,        // mapping from keys to labels
            template: {root: 'select'},
        });
    }
    formatted_value() {
        return this.data[this.value];
    }
    get_field_value() {
        return {v: this.value, f: this.formatted_value()};
    }
    options(data, fn) {
        const self = this;
        let keys;
        if (is.isFunction(fn)) {
            if (data) {
                // list of 2-"tuples"
                if (is.isArray(data)) {
                    if (data.length > 0 && is.isArray(data[0]) && data[0].length === 2) {
                        data.forEach(function (kv) {
                            fn(kv[0], kv[1]);
                        });
                    }
                } else {
                    // dict based data (potentially with an __order member).
                    keys = data.__order? data.__order: Object.keys(data);
                    keys.forEach(function (key) {
                        fn(key, data[key]);
                    });
                }
            }
        }
    }
    construct() {
        this.prepare();
    }
    draw(data) {
        const self = this;
        this.options(data || this.data, function (attr, value) {
            self.widget().append(dk.$('<option/>').val(attr).text(value));
            self.widget().append('\n');
        });
    }
}


export class RadioSelectWidget extends SelectWidget {
    constructor() {
        super({
            template: {root: 'div'},
        });
    }
    get value() {
        return this.widget(':checked').val();
    }
    set value(v) {
        this.widget(':radio').val([v.value || v.v || v]);
        return v;
    }
    construct() {
        this.prepare();
    }
    draw(data) {
        this.options(data || this.data, (attr, value) => {
            const radio = self.layout.make('input', {
                type: 'radio',
                name: this.name,
                id: dk.counter(this.name + '-')
            });
            const label = this.layout.make('label', {
                id: radio.prop('id') + '-label',
                'for': radio.prop('id')
            }).text(value);
            radio.val(attr);
            label.prepend('&nbsp;').prepend(radio);
            this.widget().append(label);
            this.widget().append('\n');
        });
    }
    handlers() {
        this.widget().on('change', ':radio', () => {
            this.notify('change', this);
        });
    }
}


export class CheckboxSelectWidget extends RadioSelectWidget {
    get value() {
        const res = [];
        this.widget(':checked').each(function () {
            res.push(dk.$(this).val());
        });
        return res;
    }
    set value(v) {
        this.widget(':checkbox').val([v.value || v.v || v]);
        return v;
    }
    construct() {
        this.prepare();
    }
    draw(data) {
        this.options(data || this.data, (attr, value) => {
            const chkbx = this.layout.make('input', {
                type: 'checkbox',
                name: this.name,
                id: dk.counter(this.name + '-')
            });
            const label = this.layout.make('label', {
                id: chkbx.prop('id') + '-label',
                'for': chkbx.prop('id')
            }).text(value);
            chkbx.val(attr);
            label.prepend('&nbsp;').prepend(chkbx);
            this.widget().append(label);
            this.widget().append('\n');
        });
    }
    handlers() {
        this.widget().on('change', ':checkbox', () => {
            this.notify('change', this);
        });
    }
}


// XXX: is this a form widget?
export class TriboolWidget extends InputWidget {
    constructor(label) {
        super({
            values: { 0: 0, 1: 1, 2: 2 },
            structure: {  // basic layout of widget
                tribool_label_box: {},
                true_widget_box: {
                    css: { float: 'left' }
                },
                false_widget_box: {
                    css: { float: 'left' }
                },
            }
        });
        // values: { 0: none, 1: true, 2: false },
        this.value = 0;
        this.label = label;
    }
    construct() {
        this.prepare();
        // fixme: add to structure
        this.tribool_label_box.text(this.label.text);
        this.true_widget = dk.$('<button type="button" class="btn btn-default btn-circle"><dk-icon src="check checked"></dk-icon></button>');
        this.true_widget_box.append(this.true_widget);
        this.false_widget = dk.$('<button type="button" class="btn btn-default btn-circle"><dk-icon src="minus checked"></dk-icon></i></button>');
        this.false_widget_box.append(this.false_widget);
    }
    draw(value) {
        if (value === undefined) return;

        switch (value) {
            case 0:
                this.true_widget.removeClass('btn-success').addClass('btn-default');
                this.false_widget.removeClass('btn-danger').addClass('btn-default');
                break;
            case 1:
                //this.true_widget.toggleClass('btn-default btn-success');
                this.true_widget.removeClass('btn-default').addClass('btn-success');
                this.false_widget.removeClass('btn-danger').addClass('btn-default');
                break;
            case 2:
                //this.false_widget.toggleClass('btn-default btn-danger');
                this.true_widget.removeClass('btn-success').addClass('btn-default');
                this.false_widget.removeClass('btn-default').addClass('btn-danger');
                break;
        }
    }
    handlers() {
        const self = this;
        this.true_widget.on('click', function () {
            switch (self.value) {
                case 0: self.value = 1; break;
                case 1: self.value = 0; break;
                case 2: self.value = 1; break;
            }
            self.draw(self.value);
            dk.trigger(self.widget, 'change', self.widget);
            self.notify('change', self);
        });
        this.false_widget.on('click', function() {
            switch (self.value) {
                case 0: self.value = 2; break;
                case 1: self.value = 2; break;
                case 2: self.value = 0; break;
            }
            self.draw(self.value);
            dk.trigger(self.widget, 'change', self.widget);
            self.notify('change', self);
        });
    }
}
