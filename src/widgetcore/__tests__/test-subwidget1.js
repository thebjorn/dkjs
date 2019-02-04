

import $ from "jquery";
import utidy from "../../browser/dk-html";
import {Widget} from "../dk-widget";
import page from "../dk-page";

/**
 *  A widget that draws a colored circle.
 */
test("Subwidgets: LightWidget", () => {
    document.body.innerHTML = `
    <div id="work">
    </div>
    `;
    const work = $('#work');
    page.initialize(document);

    // const LightWidget = Widget.extend({
    //     type: 'LightWidget',
    //     color: 'yellow',
    //     set_color: function (color) {
    //         this.color = color;
    //         this.draw(color);
    //     },
    //     draw: function (color) {
    //         this.widget().css('background-color', color || this.color);
    //     },
    //     construct: function () {
    //         this.widget().addClass('circle light').css({
    //             borderRadius: '50%',
    //             width: 100,
    //             height: 100,
    //             backgroundColor: 'yellow'
    //         });
    //     }
    // });
    // LightWidget.create_inside(work, {});

    class LightWidget extends Widget {
        color = 'yellow';
        set_color(color) {
            this.color = color;
            this.draw(color);
        }
        draw(color) {
            this.widget().css('background-color', color || this.color);
        }
        construct() {
            this.widget().addClass('circle light').css({
                borderRadius: '50%',
                width: 100,
                height: 100,
                backgroundColor: 'yellow'
            });
        }
    }
    LightWidget.create_inside(work, {});

    expect(utidy(work.html())).toEqual(utidy(`
        <div class="LightWidget circle light" id="light-widget" style="border-radius: 50%; width: 100px; height: 100px; background-color: yellow;"></div>
    `));
});


/*
const NewClass = Widget.extend({...}) to class NewClass extends Widget {} conversion
--------------------------------------------------------------------------------------

1. use class syntax, per title (above).
2. Remove type attribute.
2. convert data attributes 
   a. don't use class attributes (as they'll overwrite props)
   
      class LightWidget extends Widget {
          color = 'yellow';   // NO, BAD!
          ...
          
   b. use Object.assign to create them in the constructor:
   
      class LightWidget extends Widget {
          constructor(...args) {
              super(Object.assign({<default-values>, ...args));
              ...
   
      super() has to be the first statement, and it assigns all attributes 
      passed in (using a props object). Object.assign is used so the props
      object's properties (those that are present) will override the default 
      values.
3. move contents of init() {..} into constructor.

 
 */
