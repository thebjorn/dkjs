

import $ from "jquery";
import utidy from "../../browser/dk-html";
import {Widget} from "../dk-widget";
import page from "../dk-page";
import dk from "../../dk-obj";

/**
 *  A basic button widget.
 *
 */
test("ButtonWidget", () => {
    document.body.innerHTML = `
    <div id="work">
    </div>
    `;
    const work = $('#work');
    page.initialize(document);

    class ButtonWidget extends Widget {
        constructor(props) {
            super(Object.assign({
                color: 'default',
                template: {root: 'button'},
                css: {width: '100%'}
            }, props));
        }
        
        draw() {
            this.widget().text(this.color);
        }
        handlers() {
            this.retrigger('click');  // convert a click event to a dk.js triggered event
        }
    }
    const button = ButtonWidget.create_inside(work, {color: 'blue'});
    
    
    expect(utidy(work.html())).toEqual(utidy(`
        <button id="button-widget" class="ButtonWidget" style="width: 100%;">
            blue
        </button>
    `));
    
    let val = "";
    dk.on(button, 'click', () => val = '42');   // attach an event handler
    button.widget().click();                    // use jquery to simulate a click.
    expect(val).toBe('42');
});
