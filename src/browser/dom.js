// LVL:0

/**
 * Helper function to create a DOM node.
 *
 * @param node
 * @param attrs
 * @returns {HTMLElement}
 */
export function create_dom(node, attrs) {       // exported as dk.node(..)
    let dom = document.createElement(node);
    Object.entries(attrs || {}).forEach(([k, v]) => dom.setAttribute(k, v));
    return dom;
}



var $ = require('jquery');
var _ = require('lodash');
var dk = require('../boot');
var counter = require('../core/dk-counter.js');

$(function () {
// create popup windows from links with class=popup
    $('a.popup').click(function () {
        var w = window.open(
            $(this).prop('href'),
            $(this).prop('id') || "WindowName",
            ('width=' + $(this).attr('width') +
                ',height=' + $(this).attr('height') +
                ',resizeable=yes,' +
                'scrollbars=yes,' +
                'toolbar=no,' +
                'location=no,' +
                'directories=no,' +
                'status=no,' +
                'menubar=no,' +
                'copyhistory=no')
        );
        if (w) w.focus();
        return false;
    });
});

/*
 *  Structure syntax::
 *
 *      structure: {
 *          css: {...},
 *          classes: ['list', 'of', 'strings'],
 *          query: 'jquery-css-string',
 *          create: true,
 *          template: 'template string to pass to $(..)',
 *
 *          sub_item1: {..structure..],
 *          sub_item2: {..structure..}
 *      }
 *
 *  .css is applied directly to the item. All .classes are added using
 *  $.addClass(), in addition the sub-structure name is added as a class
 *  for sub structures.  The .query can be specified to override the
 *  default search based on the sub-structure's name.  If .create is
 *  true (default), then the item will be created unless we find it in
 *  the dom.  .template is the template we pass to $(..) to create a
 *  new dom-node.  It can be overriden by the widgets .template
 *  property.
 */
//noinspection JSLint
var dom = {
    _inline_elements: ['a', 'abbr', 'acronym', 'b', 'basefont', 'bdo',
        'big', 'br', 'cite', 'code', 'dfn', 'em', 'font', 'i', 'img',
        'input', 'kbd', 'label', 'q', 's', 'samp', 'select', 'small',
        'span', 'strike', 'strong', 'sub', 'sup', 'textarea', 'tt', 'u',
        'var', 'applet', 'button', 'del', 'iframe', 'ins', 'map', 'object',
        'script'],
    _block_elements: ['address', 'blockquote', 'center', 'dir', 'div', 'dl',
        'fieldset', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr',
        'isindex', 'menu', 'noframes', 'noscript', 'ol', 'p', 'pre', 'table',
        'ul', 'dd', 'dt', 'frameset', 'li', 'tbody', 'td', 'tfoot', 'th',
        'thead', 'tr', 'applet', 'button', 'del', 'iframe', 'ins', 'map',
        'object', 'script', 'main', 'section', 'article', 'nav', 'header',
        'footer'],
    _self_closing_elements: [ 'area', 'base', 'br', 'col', 'command',
        'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param',
        'source', 'track', 'wbr' ],

    is_inline: function (tag) { return _.contains(this._inline_elements, tag); },
    is_block: function (tag) { return _.contains(this._block_elements, tag); },
    is_tag: function (tag) { return this.is_inline(tag) || this.is_block(tag); },
    is_self_closing: function (tag) { return _.contains(this._self_closing_elements, tag); },

    /*
     *  Compare two dom nodes for equality.
     */
    equal: function (a, b) {
        if (!a.jquery) a = $(a);
        if (!b.jquery) b = $(b);
        var cur = 0;
        while (cur < a.length) {
            if (!a[cur].isEqualNode(b[cur])) {
                dk.debug("not equal:", a[cur], b[cur]);
                return false;
            }
            ++cur;
        }
        return true;
    },

    /*
     *  Add an .appendln() method to item which is just like $.append()
     *  and also adds a newline to the html source (very useful for debugging).
     */
    dkitem: function (item) {
        item.appendln = function () {
            item.append('\n\t\t');
            var res = item.append.apply(item, arguments);
            item.append('\n\t\t');
            return res;
        };
        return item;
    },

    /*
     *  dk.dom.dkitem(
     *      $(location).find(selector)
     *  );
     */
    find: function (selector, location) {
        var found = location.find.call(location, selector + ':eq(0)');
        if (found.length > 0) {
            return this.dkitem(found);
        } else {
            return null;
        }
    },

    id: function (v) {
        return document.getElementById(v);
    },

    /*
     *  Get a single item (name inspired from YUI/AUI).
     */
    one: function () {
        var tmp = $.apply($, arguments);
        if (tmp.length >= 1) {
            return tmp[0];
        }
        return null;
    },

    /*
     *  Find the enclosing element by writing a div tag to the document,
     *  then finding it, and finally getting its .parent(). Sets the id
     *  of the parent to a unique identifier if it doesn't have an id
     *  attribute already.
     */
    here: function (name) {
        var _unique = counter(name || 'dk-here-');
        /* jshint -W060 */
        document.write('<div id="' + _unique + '"></div>');
        var sentinel = $('#' + _unique);
        var parent = sentinel.parent();
        sentinel.remove();
        var id = parent.prop('id');
        if (!id) parent.prop('id', _unique);
        return parent;
    }

//    /*
//     *  Return multiple items.
//     */
//    find: function () {
//        return $.apply($, arguments);
//    }
};
module.exports = dom;
