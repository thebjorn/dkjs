import dk from "../dk-obj";
import {dkrequire} from "../lifecycle/browser/dk-require";


class IconLibrary {
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
        let res = item || dk.$('<i class="icon"/>');
        let nameparts = name.split(':');
        name = nameparts[0];

        res.addClass(this.classes);
        let classname = this.prefix + (this[name] !== undefined ? this[name] : name);
        res.addClass(classname);
        res.addClass(name);
        if (nameparts.length > 1) {
            let attrs = nameparts[1].split(',');
            attrs.forEach(attr => {
                if (this[attr.replace('-', '_')]) {
                    res = this[attr.replace('-', '_')](res);
                } else {
                    res.addClass(this.prefix + attr);
                }
            });
        }

        if (style) res.css(style);

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
