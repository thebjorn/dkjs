'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LightWidget3 = function (_dk$Widget) {
    _inherits(LightWidget3, _dk$Widget);

    function LightWidget3(props) {
        _classCallCheck(this, LightWidget3);

        return _possibleConstructorReturn(this, (LightWidget3.__proto__ || Object.getPrototypeOf(LightWidget3)).call(this, {
            color: 'yellow'
        }, props));
    }

    _createClass(LightWidget3, [{
        key: 'set_color',
        value: function set_color(color) {
            this.color = color;
            this.draw(color);
        }
    }, {
        key: 'draw',
        value: function draw(color) {
            this.widget().css('background-color', color || this.color);
        }
    }, {
        key: 'construct',
        value: function construct() {
            this.widget().addClass('circle light').css({
                borderRadius: '50%',
                width: 100,
                height: 100,
                backgroundColor: this.color
            });
        }
    }]);

    return LightWidget3;
}(dk.Widget);

var ButtonWidget3 = function (_dk$Widget2) {
    _inherits(ButtonWidget3, _dk$Widget2);

    function ButtonWidget3(props) {
        _classCallCheck(this, ButtonWidget3);

        return _possibleConstructorReturn(this, (ButtonWidget3.__proto__ || Object.getPrototypeOf(ButtonWidget3)).call(this, {
            color: null,
            template: { root: 'button' },
            css: { margin: 4 }
        }, props));
    }

    _createClass(ButtonWidget3, [{
        key: 'draw',
        value: function draw() {
            this.widget().text(this.color);
        }
    }, {
        key: 'handlers',
        value: function handlers() {
            this.notify_on('click');
        }
    }]);

    return ButtonWidget3;
}(dk.Widget);

var ColorLight = function (_dk$Widget3) {
    _inherits(ColorLight, _dk$Widget3);

    function ColorLight(props) {
        _classCallCheck(this, ColorLight);

        var _this3 = _possibleConstructorReturn(this, (ColorLight.__proto__ || Object.getPrototypeOf(ColorLight)).call(this, {
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
                        flexDirection: 'column'
                        // top: 5,
                        // bottom: 5,
                        // right: 5,
                        // width: 'calc(50% - 2*5px)'
                    }
                }
            }
        }, props));

        _this3.colors = _this3.colors.split(',');
        _this3.widgets = {};
        return _this3;
    }

    _createClass(ColorLight, [{
        key: 'draw',
        value: function draw() {
            this.lightwidget.draw();
        }
    }, {
        key: 'set_color',
        value: function set_color() {
            return this.light.set_color.apply(this.light, arguments);
        }
    }, {
        key: 'construct_lightwidget',
        value: function construct_lightwidget(location) {
            return LightWidget3.create_inside(location, {
                color: 'seagreen',
                css: {
                    // float: 'left',
                    margin: 5
                }
            });
        }
    }, {
        key: 'construct',
        value: function construct() {
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
    }]);

    return ColorLight;
}(dk.Widget);

ColorLight.create_inside("#work");

