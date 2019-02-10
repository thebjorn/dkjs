

// import $ from "jquery";
// import {Template} from "../dk-dom-template";
// import utidy from "../dk-html";

/**
 * The `append_to()` method is useful when constructing lists.
 *
 */
window.test_functions['dom-template2'] = function(env) {
    env.body.append('<ul/>');

    function add(txt) {
        const structure = {
            li: { text: txt }
        };
        const templ = new dk.Template(structure);
        const node = templ.append_to(env.body.find('ul'));
        node.li.css('font-weight', 'bold');
        node.li.attr('selected', true);
    }

    add("hello");
    add("world");
    
    env.done(dk.utidy(env.body.html()) == dk.utidy(`
        <ul>
            <li selected style="font-weight: bold;">hello</li>
            <li selected style="font-weight: bold;">world</li>
        </ul>`
    ));
};
