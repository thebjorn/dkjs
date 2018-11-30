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
