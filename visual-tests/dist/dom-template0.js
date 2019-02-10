"use strict";

// import $ from "jquery";
// import {Template} from "../dk-dom-template";
// import utidy from "../dk-html";

/**
 * The simplest form of creating a structure using dk.dom.Template().
 * We're saying the structure should have two sub-items, a `h3` element,
 * and a `div` with `class="content"`.
 *
 * After creating the _structure_, we add text to the created
 * elements.
 *
 */
window.test_functions['dom-template0'] = function (env) {
  var structure = {
    h3: {},
    content: {}
  };
  var templ = new dk.Template(structure);
  var obj = templ.construct_on(env.body);
  obj.h3.text('hello');
  obj.content.text('world');
  console.log("obj:", dk.utidy(obj.html()));
  console.log("txt:", dk.utidy("\n        <h3>hello</h3>\n        <div class=\"content\">world</div>"));
  env.done(dk.utidy(obj.html()) == dk.utidy("\n        <h3>hello</h3>\n        <div class=\"content\">world</div>"));
};