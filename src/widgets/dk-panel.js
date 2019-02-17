
import {Widget} from "../widgetcore/dk-widget";
import css from "../browser/dk-css";
import dk from "../dk-obj";


export class PanelWidget extends Widget {
    constructor(props) {
        super({
            // type: 'PanelWidget',
            width: undefined,
            height: undefined,
            collapsible: true,
            direction: 'up',   // or 'left'
            blind_duration: 0.1,
            rotate_duration: 0.1,
            status: 'open',
            icons: {
                collapse: 'folder-open-o:fw',
                expand: 'folder:fw',
                color: '#888'
            },

            overflow: 'resize',   // 'hidden'|'scroll'|'resize'
            kind: 'panel-default',

            structure: {
                classes: ['dk-panel', 'panel'],
                css: {
                    position: 'relative',
                    overflow: 'hidden'
                },

                header: {
                    classes: ['panel-heading'],
                    title: {
                        classes: ['panel-title'],

                        collapseicon: {
                            css: {cursor: 'pointer'}
                        },
                        headingtext: {
                            template: 'span'
                        }
                    }
                },
                panel_body: {
                    css: {overflow: 'auto'}
                },
                footer: {
                    classes: ['panel-footer'],
                    create: false
                }
            }
        }, props);
    }

    init() {
        if (this.panel && this.panel.height && typeof this.panel.height === 'string') {
            this.height = parseInt(this.panel.height, 10);
        }
    }

    construct_headingtext(htxt) {
        if (this.title) {
            htxt.text(this.title);
        }

        if (!this.icon) this.icon = this.widget('.collapseicon > dk-icon')[0];
        if (!this.icon) {
            const icon = dk.$('<dk-icon/>').attr('value', this.icons.collapse);
            this.icon = icon[0];
            this.widget('.collapseicon').append(icon);
        }
        return htxt;
    }

    construct_panel_body(body) {
        return body;
    }

    construct() {
        if (this.widget().hasClass('collapse-up'))      this.status = 'collapse-up';
        if (this.widget().hasClass('collapse-left'))    this.status = 'collapse-left';
        if (this.height) {
            this.panel_body.outerHeight(this.height - this.header.outerHeight() - this.footer.outerHeight());
        }
        if (!this.icon)  this.icon = this.widget('.collapseicon > dk-icon')[0];
    }

    set_icon(ikn) {
        this.icon.value = ikn;
    }

    _size(item) {
        return {
            height: item.outerHeight(),
            width: item.outerWidth()
        };
    }

    collapse_up() {
        const self = this;
        const wsize = this._size(this.widget());
        const hsize = this._size(this.header);

        this.widget().addClass('collapse-up');
        const orig_maxheight = css.maxheight(this.widget(), {
            height: hsize.height,
            duration: self.blind_duration,
            done() {
                self.__collapsing = false;
            }
        });

        this._expand = function () {
            self.widget().removeClass('collapse-up');
            css.maxheight(self.widget(), {
                height: wsize.height,
                duration: self.blind_duration,
                done() {
                    self.widget().css('max-height', orig_maxheight);
                    self.__collapsing = false;
                }
            });
        };
    }

    collapse_left() {
        const self = this;
        const wsize = this._size(this.widget());
        const hsize = this._size(this.header);
        let rotation;

        const orig_maxheight = css.maxheight(this.widget(), {
            height: hsize.height,
            duration: self.blind_duration,
            done: function () {
                rotation = css.tilt(self.widget(), {
                    direction: 'bottom left',
                    duration: self.rotate_duration,
                    done: function () {
                        self.__collapsing = false;
                        self.notify('collapse-done', {
                            height: hsize.width,
                            width: hsize.height
                        });
                    }
                });
                self.widget().addClass('collapse-left');
            }
        });

        this._expand = function () {
            css.unrotate(dk.update(rotation, {
                done: function () {
                    css.maxheight(self.widget(), {
                        height: wsize.height,
                        duration: self.blind_duration,
                        done: function () {
                            self.widget().css('max-height', orig_maxheight);
                            self.__collapsing = false;
                            self.notify('expand-done', self);
                        }
                    });
                }
            }));
        };
    }

    collapse(direction) {
        this.direction = direction || this.direction;
        this['collapse_' + this.direction]();
        this.icon.value = this.icons.expand;
        this.notify('resized', this);
        this.notify('collapse', this);
    }

    expand() {
        this.widget().removeClass('collapse-' + this.direction);
        this.icon.value = this.icons.collapse;
        if (this._expand) {
            this._expand();
            this._expand = null;
        }
        this.notify('resized', this);
        this.notify('expand', this);
    }

    handlers() {
        const self = this;
        if (this.collapsible) {
            //this.__collapsing = new Date();

            this.header.on('click dblclick', function () {
                if (self.__collapsing) return;
                self.__collapsing = true;
                const action = self.collapsed? 'expand': 'collapse';
                self.notify(action + '-start', self);
                self[action]();
                self.collapsed = !self.collapsed;
            });
        }
    }
}
