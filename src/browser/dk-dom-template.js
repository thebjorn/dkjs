
import Class from "../lifecycle/coldboot/dk-class";
import dom from "./dom";
import dk from "../dk-obj";
import is from "../is";
import {array_difference} from "../lifecycle/set-ops";
import {pick} from "../collections";

/*
 *  Define a structured hierarchial dom tree.
 */
export class Template {

    constructor(props, domtemplates, name, position) {
        // super(props);
        if (props.name && typeof props.name !== "string") {
            throw "Syntax Error: structure.name must be a string (the tag-type of the dom-object).";
        }
        this.name = props.name || name || this.name;
        this.position = position || 0;
        this.css = props.css || this.css;
        this.classes = props.classes || [];
        this.text = props.text || this.text;
        this.create = props.create || this.create;
        this.query = props.query || this.query;
        this.query += ':eq(0)';
        this.location = props.location || this.location;

        this.template = '<div/>';
        let tmptemplate = props.template;
        if (!tmptemplate && domtemplates) tmptemplate = domtemplates[this.name];
        if (!tmptemplate && dom.is_tag(this.name)) tmptemplate = `<${this.name}/>`;
        if (tmptemplate) this.template = tmptemplate;

        this.structure = props.structure || {};

        const subitems = array_difference(Object.keys(props), Object.keys(this));
        [...subitems].forEach((item, position) => {
            this.structure[item] = new Template(props[item], domtemplates, item.replace('-', '_'), position);
        });
        if (is.isEmpty(this.structure)) delete this.structure;
    }

    /*
     *  Create template structure onto location,
     *  call `creator.create_foo()` for any `foo` items,
     *  finally attach sub-item accessors to `accessor`.
     *
     *  Let's say we have
     *
     *      <div id="foo"></div>
     *
     *  and want to create:
     *
     *      <div id="foo">
     *          <h3>hello</h3>
     *          <div class="content">world</div>
     *      </div>
     *
     *  we describe the structure
     *
     *      var structure = {
     *          h3: {},
     *          content: {}
     *      };
     *
     *  version #1, one-line'ish
     *
     *      var dom = new Template(structure).construct_on('#foo');
     *      dom.h3.text('hello');
     *      dom.content.text('world');
     *
     *  version #2, using a creator object (widget):
     *
     *      var creator = {
     *          construct_h3: function (location) {
     *              location.text('HELLO');
     *          },
     *          construct_content: function (location) {
     *              location.text('WORLD');
     *          }
     *      };
     *
     *      var templ = new Template(structure);
     *      templ.construct_on('#foo', creator);
     *
     *  version #3, a partially filled out html/dom-structure:
     *
     *      <div id="foo">
     *          <h3 style="border:3px solid green;"></h3>
     *      </div>
     *
     *  ..running the same code as version #2 gives us:
     *
     *      <div id="foo">
     *          <h3 style="border:3px solid green;">HELLO</h3>
     *          <div class="content">WORLD</div>
     *      </div>
     *
     *
     */
    construct_on(location, creator, accessor) {
        const domitem = new DomItem(this);
        return domitem.construct_on(location, creator, accessor);
    }

    append_to(location, creator, accessor) {
        if (accessor === undefined) accessor = {};
        Object.keys(this.structure).forEach(key => {
            const domitem = new DomItem(this.structure[key]);
            accessor[key] = domitem.append_to(location, creator, accessor);
        });
        return accessor;
    }

    toString() {
        return JSON.stringify(pick(this, 'name', 'css', 'classes', 'create', 'query', 'template', 'structure'), null, '    ');
    }

    toStringNonRecursive() {
        return JSON.stringify(pick(this, 'name', 'css', 'classes', 'create', 'query', 'template'), null, '    ');
    }
}


export class DomItem extends Class {
    /*
     *  Instantiate template/structure onto dom object..
     *  (sets order, accounts for items already present, etc.)
     */
    constructor(template, parentitem) {
        super();
        this.query = undefined;
        this.subitems = undefined;
        this.item = undefined;
        this.is_root = template.name === undefined;
        this.parent = parentitem;
        this.template = template;
        this.classes = this.template.classes.slice().map(cval => cval.replace('_', '-'));
        this.keys = [];

        if (!this.is_root) {
            if (dom.is_tag(template.name)) {
                this.query = template.name;
            } else {
                this.query = '.' + template.name.replace('_', '-');
                this.classes.push(template.name.replace('_', '-'));
            }
        }

        if (this.template.structure) {
            this.keys = Object.keys(template.structure || {});
            const vals = this.keys.map(key => {
                return new DomItem(template.structure[key], this);
            });
            this.subitems = dk.zip_object(this.keys, vals);
            this._subitems = this.keys.map(key => {
                return this.subitems[key].item;
            });
        }
    }

    _insert_item(item, pos) {
        if (pos === 0) {
            this.location.prepend(item);
        } else if (!this._subitems || !this._subitems[pos - 1]) {
            this.location.append(item); //.append('\n');
        } else {
            this._subitems[pos - 1].after(item); //.append('\n');
        }
        if (this._subitems) this._subitems[pos] = item;
    }

    _make_item(creator) {
        const maker = (creator && creator.layout)? creator.layout: {make: function (t) { return dk.$(t); }};
        const item = maker.make(this.template.template);
        return this._construct_item(item);
    }

    _construct_item(item) {
        if (this.classes) item.addClass(this.classes.join(' '));
        if (this.template.css) item.css(this.template.css);
        if (this.template.text && !item.text()) item.html(this.template.text);
        return item;
    }

    get_location() {
        if (this.parent) {
            return this.parent.get_location().find(this.query);
        }
        return this.location.find(this.query);
    }

    /*
     *  Create template/structure onto dom object
     *  ..and attach accessors to self
     */
    append_to(location, creator, accessor) {
        this.accessor = accessor;
        return this.append(location, creator);
    }

    construct_on(location, creator, accessor) {
        this.accessor = accessor;
        return this.construct(location, creator);
    }

    append(location, creator) {
        this.location = (location && location.jquery)? location: dk.$(location);
        let item = this._make_item(creator);

        const accessor = this.accessor || {};

        this.forEachSubitem((subitem, key) => {
            item[key] = subitem.construct(item, creator);
            accessor[key] = item[key];
        });

        const cname = 'construct_' + this.template.name;
        if (creator && creator[cname]) {
            // if the widget defines a sub-structure construct_ method, then
            // call it with the location of the item we've created..
            item = creator[cname](item) || item;
        }
        location.append(item);

        return item;
    }
    
    forEachSubitem(fn) {
        if (is.isEmpty(this.subitems)) return;
        Object.entries(this.subitems).forEach(fn);
    }

    construct(location, creator, level) {
        if (level === undefined) level = 0;
        this.location = (location && location.jquery) ? location : dk.$(location);
        let item = this.location;

        if (this.is_root) {
            this._construct_item(item);
        } else {
            item = dom.find(this.query, this.location);

            if (item === null && this.template.create !== false) {
                // not found, creating..
                item = this._make_item(creator);
                this._insert_item(item, this.template.position);
            } else if (item !== null) {
                this._construct_item(item);
            }
        }

        const accessor = this.accessor || {};
        this.forEachSubitem(([key, subitem]) => {
            item[key] = subitem.construct(item, creator, level + 1);
            accessor[key] = item[key];
        });

        const cname = 'construct_' + this.template.name;
        if (!this.is_root && creator && creator[cname]) {
            // if the widget defines a sub-structure construct_ method, then
            // call it with the location of the item we've created..
            item = creator[cname](item) || item;
        }
        return item;
    }
    //
    //    construct: function (location, creator, level) {
    //        if (level === undefined) level = 0;
    //        this.location = (location && location.jquery)? location: dk.$(location);
    //        // dk.info(indent(level), 'constructing:', this.template.template, this.toString(), this.location);
    //        // dk.info(indent(level+1), 'get_location', this.get_location());
    //        var item = this.location;
    //
    //        function indent(n) {
    //            var s = '';
    //            for (var i=0; i<n; i++) {
    //                s += '    ';
    //            }
    //            return s;
    //        }
    //
    //        if (this.is_root) {
    //            // dk.info(indent(level+1), 'is_root');
    //            this._construct_item(item);
    //        } else {
    //            // dk.info(indent(level + 1), 'not root');
    //            //// dk.info(indent(level + 1), 'looking for %s in '.format(this.query), this.parent.location);
    //            // dk.info(indent(level + 1), 'looking for %s in '.format(this.query), this.location);
    //            //item = dk.dom.find(this.query, this.parent.location);
    //            item = dk.dom.find(this.query, this.location);
    //            //if (item) dk.info(indent(level + 1), 'found existing item');
    //
    //            if (item === null && this.template.create !== false) {
    //                // dk.info(indent(level + 1), 'not found, creating instead..');
    //                item = this._make_item(creator);
    //                // dk.info(indent(level + 1), 'constructed:', item);
    //                this._insert_item(item, this.template.position);
    //                // dk.info(indent(level + 1), 'inserted item');
    //            }
    //            var cname = 'construct_' + this.template.name;
    //
    //            if (creator && creator[cname]) {
    //                // if the widget defines a sub-structure construct_ method, then
    //                // call it with the location of the item we've created..
    //                // dk.info(indent(level + 1), 'calling creator..');
    //                item = creator[cname](item) || item;
    //            }
    //        }
    //
    //        var accessor = this.accessor || {};
    //        Object.entries(this.subitems).forEach(([key, subitem]) => {
    //            item[key] = subitem.construct(item, creator, level+1);
    //            accessor[key] = item[key];
    //        });
    //
    //        // dk.info(indent(level), 'done constructing');
    //        return item;
    //    },

    toString() {
        let subnodes = "[";
        /* if (this._subitems) {
         this._subitems.forEach(function (item) {
         subnodes += item.toString();
         });
         } */
        subnodes += ']';
        return "DomItem(%s, [%s])".format(this.template.template, this.keys);
        //return JSON.stringify(pick(this, '_templatestring', 'classes', 'position', 'query', 'subitems'), null, '    ');
    }
}
