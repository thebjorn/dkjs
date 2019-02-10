"use strict";

// import $ from "jquery";
// import {Template} from "../dk-dom-template";
// import utidy from "../dk-html";

/**
 * The `append_to()` method is useful when constructing lists.
 *
 */
window.test_functions['dom-template3'] = function (env) {
  env.body.append('<ul/>');

  function add(txt) {
    var structure = {
      li: {
        text: txt
      }
    };
    var templ = new dk.Template(structure);
    var node = templ.append_to(env.body.find('ul'));
    node.li.css('font-weight', 'bold');
    node.li.attr('selected', true);
  }

  add("hello");
  add("world");
  env.done(dk.utidy(env.body.html()) == dk.utidy("\n        <ul>\n            <li selected style=\"font-weight: bold;\">hello</li>\n            <li selected style=\"font-weight: bold;\">world</li>\n        </ul>"));
};
