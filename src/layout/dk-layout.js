
import dk from "../dk-obj";
import Class from "../lifecycle/coldboot/dk-class";
import {dkconsole} from "../lifecycle/dkboot/dk-console";
import {Template} from "../browser/dk-dom-template";
import counter from "../core/counter";


export class Layout extends Class {
    /*
     *  Remember to always call this._super(location) in the init()
     *  method of subclasses.
     */
    constructor(widget, location, template, structure) {
        super();
        this.class_name = 'dk-bx';
        const self = this;
        // location is the dom id onto which the layout should be realized
        this.widget = widget;

        widget.layout = this;

        this.location = location;
        this.template = template;   // must not be hierarchical/nested

        this.location.addClass(widget.type);
        if (widget.kind) this.location.addClass(widget.kind);
        if (widget.classes) this.location.addClass(widget.classes.join(' '));
        if (widget.css) this.location.css(widget.css);

        if (structure) {
            this.structure = new Template(structure, this.template);
            this.structure.construct_on(this.location, this.widget, this.widget);
        }
        if (self !== this) dkconsole.info('layout self = this', self === this);
        this.construct();
    }
    
    delete_layout() {
        delete this.template;
        delete this.widget.layout;
        delete this.widget;
        delete this.structure;
    }

    construct() {}

    /*
     *  Add an .appendln() method to item which is just like $.append()
     *  and also adds a newline to the html source (very useful for debugging).
     */
    _dkobj(item) {
        item.appendln = function () {
            item.append('\n');
            var res = item.append.apply(item, arguments);
            item.append('\n');
            return res;
        };
        return item;
    }

    /*
     *  Create an element from ``argments``, and give it an ID.
     *  (like $, but ensure ID).
     */
    $() {
        const res = dk.$.apply(dk.$, arguments);
        if (!res.prop('id')) {
            res.prop('id', counter(this.class_name + '-'));
        }
        return res;
    }

    /*
     *  $(location).find(selector);
     */
    find(selector, location) {
        location = location || this.location;
        var found = location.find.call(location, selector);
        if (found.length > 0) {
            return this._dkobj(found);
        } else {
            return null;
        }
    }

    find_or_create(selector, location) {
        location = location || this.location;
        const found = location.find.call(location, selector);
        if (found.length > 0) {
            return this._dkobj(found);
        } else {
            const item = this.make(selector);
            location.append(item);
            return item;
        }
    }

    /*
     *  Find or insert a dom element.
     */
    findsert(selector, createfn) {
        const item = this.location.find(selector);
        if (item.length > 1) return item[0];
        if (item.length === 1) return item;
        return createfn.call(this, selector);
    }

    /*
     *  Create an instance of template or a general tag, eg.:
     *
     *     this.make('foo')  =>  this.$(this.template.foo)
     *     this.make('span') =>  this.$(this.template.span) ..or..
     *                           this.$('<span/>')          ..if there is no template.span
     */
    make(template, props) {
        let item;
        if (template[0] === '<') {
            item = this.$(template);
        } else {
            item = this.$(this.template[template] || ('<' + template + '/>'), props);
        }
        return this._dkobj(item);
    }

    appendln() {
        this.location.append('\n');
        this.location.append.apply(this.location, arguments);
        this.location.append('\n');
        return this.location;
    }
}
