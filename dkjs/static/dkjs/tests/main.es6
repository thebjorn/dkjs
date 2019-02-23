/*
    Needs to be compile for IE11
    babel --presets env main.es6 > main.js
    
    (npm i babel-core -D
    npm i babel-presets-env -D)
 */

class LightWidget3 extends dk.Widget {
    constructor(props) {
        super({
            color: 'yellow'
        }, props);
    }
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
            backgroundColor: this.color
        });
    }
}

class ButtonWidget3 extends dk.Widget{
    constructor(props) {
        super({
            color: null,
            template: {root: 'button'},
            css: { margin: 4}
        }, props);
    }
    draw() {
        this.widget().text(this.color);
    }
    handlers() {
        this.retrigger('click');
    }
}

export class ColorLight extends dk.Widget{
    constructor(props) {
        super({
            colors: 'red,yellow,green',

            structure: {
                classes: ['clearfix'],
                css: {
                    position: 'relative',
                    display: 'flex',
                    border: '1px dashed #999'
                },

                light: {
                    css: {
                        marginRight: 50
                    }
                },
                btngrp: {
                    css: {
                        border: '3px solid green',
                        // position: 'absolute',
                        display: 'flex',
                        flexDirection: 'column',
                        // top: 5,
                        // bottom: 5,
                        // right: 5,
                        // width: 'calc(50% - 2*5px)'
                    }
                }
            }
        }, props);
        this.colors = this.colors.split(',');
        this.widgets = {};
    }

    draw() {
        this.lightwidget.draw();
    }
    set_color() {
        return this.light.set_color.apply(this.light, arguments);
    }
    construct_lightwidget(location) {
        return LightWidget3.create_inside(location, {
            color: 'seagreen',
            css: {
                // float: 'left',
                margin: 5
            }
        });
    }
    construct() {
        var self = this;

        this.lightwidget = this.construct_lightwidget(this.light);
        this.lightwidget.set_color('hotpink');

        this.buttons = {};
        this.colors.forEach(function (color, i) {
            self.buttons[color] = ButtonWidget3.append_to(self.btngrp, {
                color: color
            });
        });

        this.colors.forEach(function (color) {
            dk.on(self.buttons[color], 'click').run(function () {
                self.lightwidget.set_color(color);
            });
        });
    }
}

