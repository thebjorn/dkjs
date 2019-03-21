import dk from "../dk-obj";
import {dkrequire, dkrequire_loaded} from "../lifecycle/browser/dk-require";
import dom from "../browser/dom";
import {UIWidget} from "../widgetcore/ui-widget";
import {dkconsole} from "../lifecycle/dkboot/dk-console";


const dkicon_value = Symbol('dkicon_value');
const fa4_data = {
    classes: ['icon', 'fa'],  // verbose classes that should be added
    prefix: 'fa-',
    url: 'https://static.datakortet.no/font/fa470/css/font-awesome.css',
    icons: { 
        remove: 'trash-o',
        cancel: 'times-circle-o',
        up: 'chevron-up',
        down: 'chevron-down'
    },
    loaded: false,
    icon(name) {
        return this.icons[name] || name;
    }
};

function parse_icon_value(value) {
    let [name, ...modifier_list] = (value || "").split(':');
    const modifier_spec = modifier_list.join(',');              // string
    const modifiers = modifier_spec.split(',').filter(x => !!x).map(attr => fa4_data.prefix + attr);
    return [name, modifiers];
}


export function fa4_icon(node, value) {
    if (!node || !value) {
        dkconsole.warn("Missing node (${node}) or value (${value}).");
        return node;
    }
    if (!fa4_data.loaded) {
        if (!dkrequire_loaded(fa4_data.url)) dkconsole.error(`You need to include ${fa4_data.url} in the header!`);
    }
    let [new_name, new_modifiers] = parse_icon_value(value);
    if (!new_name) {
        dkconsole.warn("You need to specify an icon name in: ${value}.");
        return node;
    }
    const current_value = node[dkicon_value];
    if (current_value) {
        let [name, modifiers] = parse_icon_value(current_value);
        name = fa4_data.icon(name);
        dom.remove_classes(
            node,
            name, ...fa4_data.classes, fa4_data.prefix + name, ...modifiers
        );
    }
    
    new_name = fa4_data.icon(new_name);
    dom.add_classes(
        node,
        ...fa4_data.classes, fa4_data.prefix + new_name, new_name, ...new_modifiers
    );
    node[dkicon_value] = value;
    node.setAttribute('icon', new_name);
    const value_attr = node.getAttribute('value');
    if (value !== value_attr) node.setAttribute('value', value);
    return node;
}


export class dkicon extends UIWidget {
    constructor(...args) {
        const props = Object.assign({
            classes: ['icon', 'fa'],
            template: {root: 'i'}
        }, ...args);
        const value = props.value;
        delete props.value;
        super(props);
        this._value = value;
        this._name = null;
        this._modifiers = [];
    }
    
    draw(value) {
        if (value == null) {
            value = this._value;
        } else {
            this._value = value;
        }
        fa4_icon(this.node, value);
    }

    get value() { return this._value; }

    set value(val) {
        if (val !== this._value) {
            this.draw(val);
        }
    }
}

export function icon(value, css) {
    const i_tag = document.createElement('i');
    fa4_icon(i_tag, value);
    if (css) Object.entries(css).forEach(([attr, val]) => i_tag.style[attr] = val);
    return i_tag;
}


// called from create_dk_package.js
export function jq_dkicons(dk) {
    dk.$(document).ready(function () {
        dk.$('[dk-icon]').each(function () {
            dk.$(this).append(icon(dk.$(this).attr('dk-icon')));
        });
    });
}


class DK_ICON extends HTMLElement {
    constructor() {
        super();
        this._value = null;
    }

    // _icon_stylesheet() {
    //     return `<link rel="stylesheet" href="${this.default.url}">`;
    // }
    //

    connectedCallback() {
        // this.root = this.attachShadow({mode: 'open'});
        // this.root.innerHTML = this._icon_stylesheet();
        // this.root.innerHTML = `<link rel="stylesheet" href="${this.default.url}">`;
        // this._tag = document.createElement('i');
        // this.root.appendChild(this._tag);
        // this.appendChild(this._tag);
        if (this.value != null) {
            fa4_icon(this, this.value);
        }
    }

    invalidate() {
        this.icon.setAttribute('value', this.value);
    }

    attributeChangedCallback(attrname, oldval, newval) {
        if (attrname === 'value') {
            if (oldval !== newval) fa4_icon(this, newval);
        }
    }

    static get observedAttributes() {
        return ['value'];
    }

    get value() {
        return this._value;
    }

    set value(val) {
        if (val !== this._value) {
            this._value = val;
            fa4_icon(this, val);
        }
    }
}

if (typeof customElements !== 'undefined') customElements.define('dk-icon', DK_ICON);
