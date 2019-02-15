import Class from "../lifecycle/coldboot/dk-class";
import dk from "../dk-obj";
import widgetmap from "./dk-widgetmap";
import counter from "../core/counter";
import page from "./dk-page";
import {Layout} from "../layout/dk-layout";
import template from "lodash.template";
import jason from "../data/datacore/dk-json";
import {cls2id} from "../core/text-utils";
import {dkconsole} from "../lifecycle/dkboot/dk-console";
import {dkwarning} from "../lifecycle/coldboot/dkwarning";
import is from "../is";
import {deep_observer} from "../data/observable";


//
// widget super class (sub-module).
//
//   you'll normally only have to implement draw() and set properties.
//


// dk.Widget class
export class Widget extends Class{
    constructor(...attrs) {
        const props = Object.assign({
            id: null,                   // DOM id of this widget (foo-widget-43)
            cache: false,               // should ajax data be cached?
            dklayout: 'Layout',
            template: {root: 'div'},
        }, ...attrs);
        const data = props.data;
        if (data !== undefined) delete props.data;
        super(props);
        if (data !== undefined) {
            this.data = data;
        }
        
        if (this.type === undefined) this.type = this.constructor.name;
        
        
        // this.__state = {
        //     visible: false,
        //     ready: false,
        //     busy: false,
        //     mode: 'run',  // 'design'
        // };
        this._node = null;
        this._visible = true;
        this.__ready = false;
    }

    /**
     * Widgets are equal if their data is equal.
     * 
     * @param other
     * @returns {*}
     */
    isEqual(other) {
        if (this.constructor === other.constructor) {
            if (this._data !== undefined && other._data !== undefined) {
                return is.isEqual(this._data, other._data);
            }
        }
        return false;
    }
    
    get data() {
        return this._data;
    }

    /**
     * Observe this.data and call this.data_changed anything changes.
     * @param newval
     */
    set data(newval) {
        if (!is.isObject(newval)) throw `widget.data must be a properties object, not ${typeof newval}`;

        this._data = deep_observer(newval, (orig_data, target, name, val, path) => {
            this.data_changed(
                this._data,
                'this.data' + path,
                val,
                name,
                target, 
            );
        });
    }

    init() {}
    /*
     widget (DOM) jQuery selector.
     */
    widget(selector) {
        // usage:  this.widget('.checkins').replaceWith(...);
        const me = dk.$('#' + this.id);
        return (selector) ? me.find(selector) : me;
    }
    
    get node() {  // cached accessor to underlying dom node.
        if (!this._node) {
            this._node = document.getElementById(this.id);
        }
        return this._node;
    }

    hide() {
        this.widget().hide('fast');
        this._visible = false;
    }

    show()  {
        this.widget().show('fast');
        this._visible = true;
    }

    toggle() {
        this.widget().toggle('fast');
        this._visible = !this._visible;
    }


    /*
     *  Get the widget state.
     */
    get_state() {
        return {};
    }

    // XXX: can this be removed? ==> no, used in dk.tree.Generation (nodelist)
    // QQQ: is it the same as create_inside(..., append=true) ??
    /*
     *  Append a place holder to this widget, then create_on this placeholder.
     */
    create_subwidget(WidgetType, props, placeholder) {
        dkwarning("create_subwidget callled..");
        if (typeof WidgetType === 'string') {
            WidgetType = widgetmap.get(WidgetType);
        }
        if (!WidgetType) dk.error("There is no known class named: ", WidgetType, widgetmap.wmap);
        props = props || {};
        const sub_id = props.id || WidgetType.next_widget_id() || counter(this.id + '-subwidget-');
        placeholder = placeholder || dk.$('<div/>');
        placeholder.prop('id', props.id || sub_id);
        this.widget().append(placeholder);
        return WidgetType.create_on(placeholder, props);
    }

    /*
     *  `construct_widget()` is called by `page.create_widget` when the
     *  page has been initialized.
     */
    construct_widget(location) {
        // dk.debug('construct widget', this);
        if (location.inside) {
            this.prepare_layout(location.inside, location.append);
        } else if (!this.id && location.on) {
            const locid = location.on.prop('id');
            if (locid) {
                this.set_widget_id(locid);
            } else {
                const widgetid = this.constructor.next_widget_id();
                location.on.prop('id', widgetid);
                this.set_widget_id(widgetid);
            }
        } else {
            this.set_widget_id(this.id);
        }
        // at this point this.widget() exists in the dom and is
        // the element onto which the widget should be created
        page.widgets[this.id] = this;
        dkconsole.debug("construct_widget:", this.id);
        //dk.debug("widget():", this.id, this.widget().attr('class'));

        this.create_layout(this.widget(), this.template, this.structure);
        this.construct();

        this.initialize();

        if (this.handlers) this.handlers();
        this.render_data();

        this.__ready = true;
        this.trigger('ready', this);
        return this;
    }

    ready(fn) {
        if (this.__ready) fn.call(this);
        dk.after(this, 'render_data', fn);
    }

    /*  #1 (only for create_inside)
     *  Widget creation: root element
     *  prepare_layout() is called if we're creating the widget
     *  inside location (as opposed to creating the widget onto
     *  an existing dom element).
     *
     *  Find, or create the root element and append it to location,
     *  and set everything up so this.widget() will work.
     */
    prepare_layout(location, append) {
        let dom, id;
        location = dk.$(location);
        const exists = location.find(this.template.root);

        if (append) {  // force append
            dom = dk.$('<' + this.template.root + '/>');
            location.append(dom);
        } else {
            if (exists.length >= 1) {
                dom = dk.$(exists[0]);
            } else {
                dom = dk.$('<' + this.template.root + '/>');
                location.append(dom);
            }
        }
        id = dom.prop('id');
        if (!id) {
            id = this.constructor.next_widget_id();
            dom.prop('id', id);
        }
        this.set_widget_id(id);
    }

    /*  #2 (used to be more complex..)
     *  set the id of the widget.
     */
    set_widget_id(new_id) {
        //dk.debug("setting widget id:", new_id);
        this.id = new_id;
        //this.name = new_id ? dk.id2name(new_id) : '';
    }

    /*  #3  Create widget.layout
     *  If the widget has a .dklayout member, then that layout class
     *  is initialized. The default layout class is dk.Layout.
     *  The layout class can discover or create the structure
     *  of the widget and is the main method of creating elements in the
     *  widget post-hoc.
     */
    create_layout(location, template, structure) {
        if (this.dklayout === 'Layout') {

            try {
                // Layout.init sets widget.layout
                this.layout = Layout.create(this, location, template, structure);
            } catch (e) {
                throw "in class: " + this.constructor.name + " :: " + e;
            }

        } else {
            if (!this.dklayout.create) dk.error("this.dklayout:", this.dklayout);
            this.layout = this.dklayout.create(this, location, template, structure);
        }
        return this;
    }

    /*  #4 Widget creation: adding dom scaffolding
     *
     */
    construct() {}

    /*  #5
     *  Widget initialization: get the correct html/DOM structure onto
     *  the page. This doesn't include "data parts" (use widget.draw()
     *  to paint those onto the page).
     *
     *  Either create new DOM and place into this.widget(), which is well
     *  defined as long as this widget is uniquely identified (cf. set_id),
     *  or bless an existing DOM structure with widgetitude (by calling
     *  widget.parse_html().
     *
     *  The `inside` parameter indicates whether the widget should be
     *  created _on_ the location or _inside_ the location.
     */
    initialize() {}

    //  #6
    //  handlers() {}   // don't uncomment

    /*  #7
     *  Render the widget data, by calling refresh() and/or draw().
     */
    render_data() {
        if (this.url) {
            this.refresh();
        } else if (this.DEFINES('refresh')) {
            // has refresh, but not url
            this.draw(this.refresh());
        } else {
            this.draw(null);
        }
    }

    /*  #8
     *  The `widget.draw(data)` method should be used to draw,
     *  i.e. incorporate new data into the widget.
     *
     *  The structure of the widget should be laid out by
     *  `widget.construct()`.
     *
     *  draw() should be overridden by subclassess (the default
     *  implementation does nothing).
     */
    draw(data) {}

    /*
     *   reflow is called when widget parameters have changed,
     *   e.g. parent container width has changed. The default
     *   action is to just call render_data().
     */
    reflow() {
        this.render_data();
    }

    set(field, value) {
        this[field] = value;
        this.trigger('set-field', this, field, value);
        this.draw(null);
    }

    /*
     *  Short hand for forwarding an event, e.g. a click event on this
     *  widget into a click notification from this widget.
     */
    notify_on(evtname) {
        dkwarning(`Widget.notify_on is deprecated, use Widget.retrigger instead`);
        const self = this;
        this.widget().on(evtname, function () {
            self.trigger(evtname, self);
        });
    }

    /*
     *  Short hand for forwarding an event, e.g. a click event on this
     *  widget into a click notification from this widget.
     */
    retrigger(evtname) {
        const self = this;
        this.widget().on(evtname, function (event) {
            self.trigger(evtname, self, event);
        });
    }

    // on/trigger is more standard names for notify/publish/subscribe
    on(evtname, fn) {
        dk.on(this, evtname, fn);
    }

    trigger(evntname, ...args) {
        dk.trigger(this, evntname, ...args);
    }

    notify(trigname, ...args) {
        dkwarning(`Widget.notify is deprecated, use Widget.trigger ${this}`);
        dk.trigger(this, trigname, ...args);
    }

    /**
     * data_changed is called whenever a change is observed in this.data...
     * 
     * @param data      - the new data (after the change)
     * @param path      - the dotted path to the field that was changed (this.data.foo.bar)
     * @param val       - the new value assigned to the path
     * @param name      - the last part of path (this.data.foo.bar => bar)
     * @param target    - the object containing `name` (for the running example it would be this.data.foo)
     */
    data_changed(data, path, val, name, target) {
        dkconsole.debug(`data-changed ${path} = ${val}, new data: ${JSON.stringify(data)}`);
        this.draw(data);
    }

    start_busy() {
        dk.info("START-BUSY: ", this.id);
        if (this.__busy) return;
        const shim_id = counter('busy-shim-');
        this.__busy = shim_id;
        const self = this;
        this.widget().addClass('busy');
        let count = 0;

        const adjust_size = function () {
            const shim = dk.$('#' + shim_id);
            const offset = self.widget().offset();
            shim.css({
                width: self.widget().outerWidth(),
                height: self.widget().outerHeight(),
                left: offset.left,
                top: offset.top
            });
            if (++count > 500) window.clearInterval(self.busyID);
        };

        if (this.widget().offset) {
            const shim = dk.$('<div/>', {busy: self.id}).prop('id', shim_id).css({
                position: 'absolute',
                zIndex: 999,
                backgroundColor: 'rgba(222,222,222,.5)'
            }).addClass('busy');
            adjust_size();
            this.busyID = window.setInterval(adjust_size, 100);
            dk.$('body').append(shim);
        }
    }

    end_busy() {
        dk.info("END-BUSY: ", this.id);
        if (!this.__busy) return;
        window.clearInterval(this.busyID);
        const shim_id = this.__busy;
        this.__busy = false;
        this.widget().removeClass('busy');
        dk.$('#' + shim_id).remove();
    }

    /*
     *  Default implementation returns self, meaning that parameters coming
     *  from instance attributes, including tag parameters coming from
     *  $.init_widgets, are handled automatically.  Sub-classes should
     *  ovverride this method when they need to fill parameters that need
     *  to be calculated in some way (e.g. fetched from an input control --
     *  at least until we get ModelViews).
     *
     *  This method should return a property object that at least contains
     *  values for all url parameters.
     */
    _get_urldata() {
        const res = {};
        if (!this.urldata) return res;
        if (typeof this.urldata === 'function') {
            return this.urldata();
        } else {
            for (const attr in this.urldata) {
                //noinspection JSUnfilteredForInLoop
                const val = this.urldata[attr];
                //noinspection JSUnfilteredForInLoop
                res[attr] = (typeof val === 'function') ? val.call(this) : val;
                //noinspection JSUnfilteredForInLoop
                if (res[attr] === undefined) throw attr;
            }
            return res;
        }
    }

    _url_is_template() {
        return this.url.indexOf('<%') !== -1 && this.url.indexOf('%>') !== -1;
    }

    /*
     *  Generates the url for this widget, and calls fetch_json_data to fetch
     *  data from this url.  Automatically prevents a second refresh from starting
     *  while the first one is still going.
     */
    refresh() {
        let url;
        if (this.waiting || !this.url) return;
        if (this._url_is_template()) {
            try {
                const urldata = this._get_urldata();
                //dk.debug("URLDATA:", urldata);
                url = template(this.url, urldata);
            } catch (err) {
                this.draw(null);
                return;
            }
        } else {
            url = this.url;
        }
        //dk.debug('url is:', url);
        this.fetch_json_data(url);
    }

    /*
     *  The fundamental method for fetching json formatted data from
     *  ``url``.
     *
     *  It signals
     *
     *     `start-fetch-data` before starting, and
     *     `fetch-data` upon success
     *
     *  Upon success, self.data is set to the received data, and .draw(data)
     *  is called.
     */
    fetch_json_data(url) {
        const self = this;
        self.waiting = true;
        self.notify('start-fetch-data', self);

        dk.ajax({
            cache: self.cache,
            dataType: /^https?:\/\//.test(url) ? 'jsonp' : 'json',
            url: url,
            statusCode: {
                404: function () {
                    dk.debug("Page not found: " + url);
                },
                500: function () {
                    // display the server error to the user.
                    window.open(url);
                    //document.location = url;
                }
            },
            error(req, status, err) {
                self.waiting = false;
                dk.warn("ERROR", req, status, err);
                self.notify('fetch-data-error', req, status, err);
                throw {error: "fetch-error", message: status + ' ' + err};
            },
            converters: {
                "text json": jason.parse
            },
            success(data) {
                self.data = data;
                self.waiting = false;
                self.notify("fetch-data", self);
                self.draw(data);
            }
        });
    }
    
    static extend(props) {
        if (props.template) props.template = dk.merge(this.template, props.template);
        if (props.structure) props.structure = dk.merge(this.structure, props.structure);
        if (props.defaults) props.defaults = dk.merge(this.defaults, props.defaults);
        const SubClass = Class.extend.call(this, props);
        SubClass.type = props.type || this.name;  // this can assign undefined

        if (SubClass.type) {
            //SubClass.type = SubClass.type.replace(/\./, '-');
            widgetmap.add(SubClass);
            SubClass.toString = function () {
                return this.type + " (ctor)";
            };
        } else {
            dk.debug('SubClass without type', SubClass);
        }

        return SubClass;
    }
    
    static next_widget_id() {
        return counter(cls2id(this.name) + '-');
    }

    /*
     *  Create an instance of this Widget class.
     *  I.e., create_onto this.widget(). Which means we must ensure we
     *        have an id.
     */
    static create() {
        let location, attrs;
        if (arguments.length >= 2) {
            location = arguments[0];
            Array.prototype.shift.call(arguments);
        } else {
            location = dk.$('body');
        }
        attrs = arguments[0];
        return this.create_on(location, attrs);
    }

    static create_on(location, attrs) {
        // we _must_ generate an id for this widget, so that
        // this.widget() works.
        try {
            const w = new this(attrs);
            if (typeof location === 'string') location = dk.$(location);
            page.create_widget(w, {on: location});
            return w;
        } catch (e) {
            dk.error(e);
        }
    }


    static create_inside(location, attrs) {
        // we must not generate an id for this widget until we
        // get to the widget's construct() method.
        try {
            const w = new this(attrs);
            if (typeof location === 'string') location = dk.$(location);
            page.create_widget(w, {inside: location});
            return w;
        } catch (e) {
            dk.error(e);
        }
    }

    static append_to(location, attrs) {
        // we must not generate an id for this widget until we
        // get to the widget's construct() method.
        try {
            const w = new this(attrs);
            if (typeof location === 'string') location = dk.$(location);
            page.create_widget(w, {inside: location, append: true});
            return w;
        } catch (e) {
            dk.error(e);
        }
    }
}


//
// /*
//  *  jQuery plugin to create widgets onto selectors.
//  */
// $.fn.dkWidget = function (WidgetType) {
//     //dk.debug('WidgetType: ', WidgetType, ' typeof: ', typeof WidgetType);
//     if (typeof WidgetType === 'string') {
//         // Look up the widget type if passed in as a string.
//         WidgetType = widgetmap.get(WidgetType);
//     }
//
//     if (!WidgetType) dk.log("There is no known class named: ", WidgetType, widgetmap.wmap);
//
//     return this.each(function () {
//         const widget_id = $(this).prop('id');
//         if (!widget_id) {
//             if (!WidgetType.type) dk.debug("Widget with no ``type`` attribute", WidgetType);
//             widget_id = WidgetType.next_widget_id();
//             $(this).prop('id', widget_id);
//         }
//         WidgetType.create_on($(this), $(this).getAttributes());
//         return widget_id;
//     });
// };
//
// //        return Widget;
//
// $(document).ready(function () {
//     // convert layout boxes to widgets
//     $('[dkwidget]').each(function () {
//         const $this = $(this);
//         const wtype = $this.attr('dkwidget');
//         const width = $this.attr('width');
//         if (width) $this.width(width);
//         const height = $this.attr('height');
//         if (height) $this.height(height);
//         $this.dkWidget(wtype);
//     });
// });
//
//
// module.exports = Widget;
