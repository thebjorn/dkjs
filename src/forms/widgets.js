/*
 *  dk.forms namespace
 *
 *  The purpose of these widgets is to auto-create widgets for inline editing of grids.
 */

import dk from "../dk-obj";
import is from "../is";
import {Duration} from "../data/datacore/dk-datatypes";
import {env} from "../lifecycle/dkboot/lifecycle-parse-script-tag";
import {InputWidget} from "./input-widget";

/*
    Global attributes:
    
    accesskey, class
    contenteditable
    contextmenu-x
    data-*
    dir
    draggable
    dropzone-x
    hidden
    id
    inputmode-x
    is
    itemid, itemprop, itemref, itemscope, itemtype
    lang
    slot
    spellcheck
    style
    tabindex
    title
    translate-x
    
 */


export class TextInputWidget extends InputWidget {
    constructor(...args) {
        super({
            template: {root: 'input'}
        }, ...args);
    }
    construct() {
        super.construct();
        if (this.node.type !== 'text') this.node.type = 'text';
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
    construct() {
        super.construct();
        if (this.node.type !== 'text') this.node.type = 'text';
    }
    parse(str) {
        if (str instanceof Duration) return str;
        return new Duration(str);
    }
    stringify(val) {
        if (val instanceof Duration) return val.toString();
        return (new Duration(val)).toString();
    }

}


export class RadioInputWidget extends InputWidget {
    constructor(...args) {
        const props = Object.assign({}, ...args);
        const _checked = props.checked || false;
        delete props.checked;
        
        super({
            template: {root: 'input'}
        }, ...args);
        this._checked = _checked;
    }
    
    construct() {
        super.construct();
        if (this.node.type !== 'radio') this.node.type = 'radio';
        this.node.checked = this._checked;
    }
    
    get checked() {
        return this._checked;
    }

    set checked(value) {
        this._checked = value;
        this.node.checked = value;  // XXX: should this be in set_node_value?
        if (env.DEBUG) this.node.setAttribute('checked', 'checked');
    }

    handlers() {
        const self = this;
        super.handlers();
        this.widget().on('change', function () {
            self._checked = self.node.checked;  // don't use setter here.
        });
    }
}

/* html attributes

        autocomplete, autofocus
        disabled
        form
        multiple
        name
        required
        size
        
 */
export class SelectWidget extends InputWidget {
    constructor(...args) {
        // console.log("ARGS:", args);
        const props = Object.assign({}, ...args);
        const options = props.options || [];
        delete props.options;
        
        const selected = props.value || [];
        delete props.value;
        
        // XXX handle values passed to create_xx(..)
        
        super({
            size: 1,
            multiple: false,
            data: {value: {}},
            template: {root: 'select'},
        }, props);
        
        this._options = {};
        this._selected = {};
        this.options = options;
        if (!this.multiple && selected.length > 1) throw "cannot have multiple values when multiple=false";
    }
    get options() { return this._options; }
    set options(options) {
        if (!Array.isArray(options)) options = Object.entries(options);
        
        // options is an Array
        this._options = {};
        if (options.length > 0) {  // options === []
            let [first, ...rest] = options;
            if (Array.isArray(first)) {  // options === [[k,v], [k,v],...]
                options.forEach(([k, v]) => this._options[k] = v);
            } else {   // optinos === [v1, v2, v3, ...]
                options.forEach(v => this._options[v] = v);
            }
        }
        Object.keys(this._options).forEach(k => this._selected[k] = false);
    }

    get value() {
        return this.data.value;
    }
    set value(v) {
        if (!Array.isArray(v)) v = [v];
        if (!this.multiple) {
            if (v.length > 1) throw "Cannot set multiple values when multiple = false!";
            Object.keys(this._selected).forEach(k => this._selected[k] = false);
        }
        v.forEach(k => this._selected[k] = true);
        const val = {};
        Object.entries(this._selected).forEach(([k, v]) => {
            if (v) val[k] = this.options[k];
        });
        this.data.value = val;
        return val;
    }
    
    set dom_value(v) {
        ++this._updating;
        this.widget().val(v);
        --this._updating;
    }
    
    rebuild_options() {
        const widget = this.widget();
        widget.empty();
        Object.entries(this.options).forEach(([attr, value]) => {
            const option = dk.$('<option/>').val(attr).text(value);
            // noinspection EqualityComparisonWithCoercionJS
            if (attr == this.value) option.attr('selected', 'selected');  // we want 1 == "1" here!
            widget.append(option);
            widget.append('\n    ');
        });
    }
    
    construct() {
        super.construct();
        if (this.options) this.rebuild_options();
    }

    draw(data) {
        if (data != null) {
            if (data.options && !is.isEqual(data.options, this.options)) {
                this.options = data.options;
                this.rebuild_options();
            } else {
                this.dom_value = data.value;
            }
        } else {
            this.dom_value = this.value;
        }
    }
    formatted_value() {
        return this.options[this.value];
    }
    get_field_value() {
        return {v: this.value, f: this.formatted_value()};
    }
}


export class RadioSelectWidget extends SelectWidget {
    constructor(...args) {
        super({
            template: {root: 'div'},
        }, ...args);
    }
    set dom_value(v) {
        if (v == null) return;
        ++this._updating;
        const value = v.value || v.v || v;
        Object.keys(value).forEach(val => {
            this.widget(`:radio[value="${val}"]`).prop("checked", true);
        });
        --this._updating;
    }
    rebuild_options() {
        const widget = this.widget();
        widget.empty();
        Object.entries(this.options).forEach(([attr, value]) => {
            const radio = this.layout.make('input', {
                type: 'radio',
                name: this.name,
                id: dk.counter(this.name + '-')
            });
            const label = this.layout.make('label', {
                id: radio.prop('id') + '-label',
                'for': radio.prop('id')
            }).text(value);
            radio.val(attr);
            // noinspection EqualityComparisonWithCoercionJS
            if (this.value == attr) radio.prop('checked', true);  // we want 1 == "1" here
            label.prepend('&nbsp;').prepend(radio);
            this.widget().append(label);
            this.widget().append('\n        ');
        });
    }
    handlers() {
        const self = this;
        this.widget().on('change', ':radio', function (e) {
            self.widget_changed({
                type: 'change',
                event: e,
                item: this
            });
            self.trigger('change', e, self);
        });
        this.retrigger('validation-change');
    }
}


export class CheckboxSelectWidget extends RadioSelectWidget {
    constructor(...args) {
        super({
            multiple: true
        }, ...args);
    }
    
    set dom_value(v) {
        if (v == null) return;
        ++this._updating;
        const value = v.value || v.v || v;
        Object.keys(value).forEach(val => {
            this.widget(`:checkbox[value="${val}"]`).prop("checked", true);
        });
        --this._updating;
    }
    rebuild_options() {
        const widget = this.widget();
        widget.empty();
        Object.entries(this.options).forEach(([attr, value]) => {
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
            // noinspection EqualityComparisonWithCoercionJS
            if (this.value == attr) chkbx.prop('checked', true);  // we want 1 == "1" here
            label.prepend('&nbsp;').prepend(chkbx);
            widget.append(label);
            widget.append('\n');
        });
    }
   
    widget_changed(event) {
        if (this._updating++ === 0 && event.type === 'change') {
            this._selected[event.item.value] = event.item.checked;
        }
        --this._updating;
    }
    handlers() {
        const self = this;
        this.widget().on('change', ':checkbox', function (e) {
            self.widget_changed({
                type: 'change',
                event: e,
                item: this
            });
            self.trigger('change', e, self);
        });
        this.retrigger('validation-change');
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
