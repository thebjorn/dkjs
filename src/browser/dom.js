/**
 * Helper function to create a DOM node.
 *
 * @param node
 * @param attrs
 * @returns {HTMLElement}
 */
export function create_dom(node, attrs) {
    let dom = document.createElement(node);
    Object.entries(attrs || {}).forEach(([k, v]) => dom.setAttribute(k, v));
    return dom;
}
