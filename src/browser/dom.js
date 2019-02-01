// LVL:0

import {dkconsole} from "../lifecycle/dkboot/dk-console";
import counter from "../core/counter";


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
const dom = {
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

    is_inline(tag) { return this._inline_elements.includes(tag); },
    is_block(tag) { return this._block_elements.includes(tag); },
    is_tag(tag) { return this.is_inline(tag) || this.is_block(tag); },
    is_self_closing(tag) { return this._self_closing_elements.includes(tag); },

    create_dom(node, attrs) {       // exported as dk.node(..)
        let dom = document.createElement(node);
        Object.entries(attrs || {}).forEach(([k, v]) => dom.setAttribute(k, v));
        return dom;
    },
    
    /*
     *  Compare two dom nodes for equality.
     */
    equal(a, b) {
        if (a.jquery && b.jquery) {
            let cur = 0;
            while (cur < a.length) {
                if (!a[cur].isEqualNode(b[cur])) {
                    dkconsole.debug("not equal:", a[cur], b[cur]);
                    return false;
                }
                ++cur;
            }
            return true;
        } else if (a.isEqualNode) {
            return a.isEqualNode(b);
        } else {
            dkconsole.debug("cannot compare:", a, b);
            return false;
        }
    },

    /*
     *  Add an .appendln() method to item which is just like $.append()
     *  and also adds a newline to the html source (very useful for debugging).
     */
    dkitem(item) {
        if (!item.jquery) throw "item must be a jquery object";
        item.appendln = function (...args) {
            item.append('\n\t\t');
            const res = item.append(...args);
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
    find(selector, location) {
        const found = location.find.call(location, selector + ':eq(0)');
        if (found.length > 0) {
            return this.dkitem(found);
        } else {
            return null;
        }
    },

    id(v) {
        return document.getElementById(v);
    },

    /*
     *  Get a single item (name inspired from YUI/AUI).
     */
    one(...args) {
        const tmp = document.querySelectorAll(...args);
        return tmp.length > 0 ? tmp[0] : null;
    },

    /*
     *  Find the enclosing element by writing a div tag to the document,
     *  then finding it, and finally getting its .parent(). Sets the id
     *  of the parent to a unique identifier if it doesn't have an id
     *  attribute already.
     *  
     *  Usage:
     *  
     *      <div id="foo">
     *          <script>
     *              const parent = dk.here();  // ==> #foo
     *          </script>
     *      </div>
     *      
     */
    here(name, doc=null) {
        const _unique = counter(name || 'dk-here-');
        doc = doc || document;
        doc.write(`<div id="${_unique}"></div>`);
        const sentinel = doc.getElementById(_unique);
        const parent = sentinel.parentNode;
        if (!parent) throw "Couldn't attach to parent.."; 
        parent.removeChild(sentinel);
        const id = parent.id;
        if (!id) parent.id = _unique;
        return parent;
    }

//    /*
//     *  Return multiple items.
//     */
//    find() {
//        return $.apply($, arguments);
//    }
};


export default dom;
