import dk from "../dk-obj";
import {dkrequire} from "../lifecycle/browser/dk-require";


// xxx: should this be exported..?
export class IconLibrary {
    constructor(props) {
        Object.assign(this, {
            url: '',
            prefix: '',
            classes: '',
        }, props);
    }

    /*
     *  name can include optional attributes::
     *
     *     play:fw,3x,li,spin,rotate-90
     *
     *  fw:             fixed witdth icon (e.g. for menus)
     *  lg,2x,3x,4x,5x: larger size
     *  border:         added border
     *  li:             list item bullet
     *  spin:           add css3 spinning animation
     *  rotate-90/180/270:
     *  flip-horizontal:
     *  flip-vertical
     */
    make_icon(name, style, item) {
        name = name || "";  // catch undefined
        // let res = item || dk.$('<i class="icon"/>');
        let res = document.createElement('i');
        let nameparts = name.split(':');
        name = nameparts[0];

        // res.addClass(this.classes);
        res.classList.add(this.classes);
        let classname = this.prefix + (this[name] !== undefined ? this[name] : name);
        // res.addClass(classname);
        res.classList.add(classname);
        // res.addClass(name);
        if (name) res.classList.add(name);
        if (nameparts.length > 1) {
            let attrs = nameparts[1].split(',');
            attrs.forEach(attr => {
                if (this[attr.replace('-', '_')]) {
                    res = this[attr.replace('-', '_')](res);
                } else {
                    // res.addClass(this.prefix + attr);
                    res.classList.add(this.prefix + attr);
                }
            });
        }

        // if (style) res.css(style);

        return res;
    }
    
    static fontawsome4() {
        return new IconLibrary({
            classes: 'fa',
            prefix: 'fa-',
            url: "https://static.datakortet.no/font/fa470/css/font-awesome.css",
            // save: 'save',
            remove: 'trash-o',
            cancel: 'times-circle-o',
            up: 'chevron-up',
            down: 'chevron-down'
            // plus, minus, play, paperclip
        });
    }
}


export const icon = (function () {
    let chosen_icons = IconLibrary.fontawsome4();
    // dkrequire(chosen_icons.url);
    return (...args) => chosen_icons.make_icon(...args);
}());


// called from create_dk_package.js
export function jq_dkicons(dk) {
    dk.$(document).ready(function () {
        $('[dk-icon]').each(function () {
            $(this).append(icon($(this).attr('dk-icon')));
        });
    });
}



customElements.define('dk-icon', class extends HTMLElement {
    constructor() {
        super();
        this.default = {
            classes: 'fa',
            prefix: 'fa-',
            url: 'https://static.datakortet.no/font/fa470/css/font-awesome.css',
            icons: {
                remove: 'trash-o',
                cancel: 'times-circle-o',
                up: 'chevron-up',
                down: 'chevron-down'
            }
        };
        this._value = null;
        this._name = null;
        this._modifiers = [];
        this._tag = null;
    }
    
    _icon_stylesheet() {
        return `<link rel="stylesheet" href="${this.default.url}">`; 
    }
    
    // IE doesn't follow the spec, and  tag.classList.add/remove only takes a single class 
    _add_classes(...classes) {
        Array.from(classes).forEach(c => this._tag.classList.add(c));
    }
    _remove_classes(...classes) {
        Array.from(classes).forEach(c => this._tag.classList.remove(c));
    }
    
    _remove_value() {
        if (!this._tag && this._name) return;
        this._remove_classes(this._name, this.default.classes, this.default.prefix + this._name, ...this._modifiers);
    }
    
    _add_value(name, modifiers) {
        if (!name) return;
        if (this.default.icons[name]) name = this.default.icons[name];
        this._name = name;
        this._modifiers = modifiers;
        this._add_classes(this._name, this.default.classes, this.default.prefix + name, ...modifiers);
    }
    
    _spec2modifiers(spec) {
        return spec.split(',').map(attr => this.default.prefix + attr);
    }
    
    _value2args(value) {
        let [name, ...modifier_list] = (value || "").split(':');
        const modifier_spec = modifier_list.join(',');              // string
        const modifiers = this._spec2modifiers(modifier_spec);
        return [name, modifiers];
    }
    
    _change_value(value) {
        this._value = value;
        if (!this._tag) return;
        this._remove_value();
        this._add_value(...this._value2args(value));
    }

    connectedCallback() {
        // this.root = this.attachShadow({mode: 'open'});
        // this.root.innerHTML = this._icon_stylesheet();
        // this.root.innerHTML = `<link rel="stylesheet" href="${this.default.url}">`;
        this._tag = document.createElement('i');
        // this.root.appendChild(this._tag);
        this.appendChild(this._tag);
        if (this.value != null) {
            this._add_value(...this._value2args(this.value));
        }
    }

    invalidate() {
        this.icon.setAttribute('value', this.value);
    }

    attributeChangedCallback(attrname, oldval, newval) {
        if (attrname === 'value') {
            this._change_value(newval);
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
            this._change_value(val);
            this.setAttribute('value', val);
        }
    }

});
