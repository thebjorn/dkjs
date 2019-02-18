import {Widget} from "../widgetcore/dk-widget";
import dk from "../dk-obj";

export class InputWidget extends Widget {
    /*
        html attributes: autocomplete, autofocus, disabled, form, list, name, 
        readonly, required, tabindex, type, value
     */
    constructor(...args) {
        // console.log("ARGS:", args);
        const props = Object.assign({}, ...args);
        if ('value' in props) {
            props.data = props.data || {};
            props.data.value = props.value;
            delete props.value;
        }
        // console.log("PROPS:", props);
        super({
            data: {
                value: null,
                // disabled: false,
                // readonly: false,
                // required: false,
                // autofocus: false,
            }
        }, props);
        // this.layout = null;
        this._validators = [];
        this._updating = false;
        this._legal_attributes = [
            'autocomplete', 'autofocus', 'disabled', 'form', 'list', 'name',
            'readonly', 'required', 'tabindex', 'type', 'value'
        ];
    }

    construct() {
        this.name = this.name || this.node.name || dk.id2name(this.id);
        if (this.node.name !== this.name) this.node.name = this.name;
        // this.node.type = this.node_type;  // xxx: it the default for <input>, but ...?
        this.widget().addClass(this.type);
        if (this.css) this.widget().css(this.css);
        if (this.value) this.dom_value = this.value;
    }

    get value() {
        return this.data.value;
    }

    set value(v) {
        const value = this.parse(v);
        this.data.value = value;
        return v;
    }

    get_value() {
        return this.value;
    }

    set_value(v) {
        this.value = v;
        return v;
    }

    formatted_value() {
        return this.value.f || this.value;
    }

    get_field_value() {
        return this.value;
    }

    set dom_value(v) {
        ++this._updating;
        this.node.value = this.stringify(v);
        // this is wrong per the html standard, but useful for debugging.
        // if (env.DEBUG) this.node.setAttribute('value', this.stringify(v));
        --this._updating;
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
                this.dom_value = v;
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
     * @param event
     */
    widget_changed(event) {
        if (this._updating++ === 0 && event.type === 'change') {
            this.value = this.parse(event.item.value);
        }
        --this._updating;
    }

    stringify(val) {
        return val;
    }

    parse(str) {
        return str;
    }

    handlers() {
        const self = this;
        this.widget().on('change input blur', function (e) {
            self.widget_changed({
                type: 'change',
                event: e,
                item: this
            });
            self.trigger('change', e, self);
        });
        this.retrigger('validation-change');
    }

    _get_attribute_data(node) {
        const attributes = {};
        Array.from(node.attributes).forEach(({name, value}) => {
            const attrval = node.getAttribute(name);
            if (attrval !== undefined && attrval !== value) {
                attributes['dk-' + name] = value;
                attributes[name] = attrval;
            } else {
                attributes[name] = value;
            }
        });
        Object.entries(this.data).forEach(([k, v]) => {
            if (attributes[k] !== v) attributes['dk-' + k] = v;
        });
        if (!attributes.type) attributes['dk-type'] = node.type;
        return attributes;
    }
    
    _create_start_node() {
        let res = `
            <${this.node.tagName.toLowerCase()}`;
        const entries = Object.entries(this._get_attribute_data(this.node));
        const indent = '\n                ';
        entries.sort().forEach(([k, v]) => res += `${indent}${k}="${v}"`);
        return res + '>';
    }

    _crete_child_nodes() {
        return "";
    }

    _create_end_node() {
        return "";
    }

    toString() {
        return this._create_start_node() + this._crete_child_nodes() + this._create_end_node()
    }
}
