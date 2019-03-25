
import {Widget} from "../widgetcore/dk-widget";
import css from "../browser/dk-css";
import dk from "../dk-obj";
import browser from "../browser/browser-version";
import {dkicon, icon} from "./dk-icon-library";


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
                        // noinspection JSSuspiciousNameCombination
                        self.trigger('collapse-done', {
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
                            self.trigger('expand-done', self);
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
        this.trigger('resized', this);
        this.trigger('collapse', this);
    }

    expand() {
        this.widget().removeClass('collapse-' + this.direction);
        this.icon.value = this.icons.collapse;
        if (this._expand) {
            this._expand();
            this._expand = null;
        }
        this.trigger('resized', this);
        this.trigger('expand', this);
    }

    handlers() {
        const self = this;
        if (this.collapsible) {
            //this.__collapsing = new Date();

            this.header.on('click dblclick', function () {
                if (self.__collapsing) return;
                self.__collapsing = true;
                const action = self.collapsed ? 'expand' : 'collapse';
                self.trigger(action + '-start', self);
                self[action]();
                self.collapsed = !self.collapsed;
            });
        }
    }
}


/**
 * Usage::
 * 
 *     <dk-panel>
 *         <h3>panel title</h3>
 *         PANEL BODY
 *     </dk-panel>
 */
if (typeof customElements !== 'undefined') customElements.whenDefined('dk-panel').then(() => {
    console.log("DK_PANEL_DEFINED:");
});

let _dk_panel_template = null;
function get_dkpanel_template() {
    if (!_dk_panel_template) {
        _dk_panel_template = document.createElement('template');
        _dk_panel_template.innerHTML = `
            <link rel="stylesheet" href="https://netdna.bootstrapcdn.com/bootstrap/3.1.0/css/bootstrap.min.css">
            <link rel="stylesheet" href="https://netdna.bootstrapcdn.com/bootstrap/3.1.0/css/bootstrap-theme.min.css">
            <link rel="stylesheet" href="https://static.datakortet.no/font/fa470/css/font-awesome.css">
            <link rel="stylesheet" href="js/dkcss.css">
            <div id="panel" class="PanelWidget dk-panel panel panel-default">
                <header class="panel-heading">
                    <div class="panel-title">
                        <span id="icon" class="collapseicon" style="cursor:pointer;"></span>
                        <span id="title-text" class="headingtext"></span>
                    </div>
                </header>
            </div>
            <slot id="panel-content"></slot>
        `;
    }
    return _dk_panel_template.content.cloneNode(true);
}
let _panel_counter = 1;

if (typeof customElements !== 'undefined') {
    if (browser.name === "msie" && browser.versionNumber <= 11) {
        customElements.define('dk-panel', class extends HTMLElement {
            constructor() {
                super();
                if (!this.id) this.id = `dk-panel-ms-${_panel_counter++}`;
            }
            connectedCallback() {
                dk.$(this).css('display', 'block');
                const $header = dk.$(this).find('>:header:first-child');
                const $img = $header.find('>img:first-child');
                $header.detach();
                dk.$(this).wrapInner('<div class="panel-body"/>');
                
                this._widget = PanelWidget.create_on('#' + this.id, {
                    title: $header.text()
                });
                try {
                    this._widget.footer.hide();
                } catch (e) {}
                if ($img.length && this._widget.header) {
                    this._widget.header.title.collapseicon.empty().append($img);
                }
            }
        });
    } else {
        
        // normal browsers..
        customElements.define('dk-panel', class extends HTMLElement {
            constructor() {
                super();
                this._height = undefined;
                this._width = undefined;
                this._collapsible = true;
                this._status = 'open';
                this._icon_open = 'folder-open-o:fw';
                this._icon_closed = 'folder:fw';
                this._dkicon = null;
                
                const shadowRoot = this.attachShadow({mode: 'open'});
                shadowRoot.append(get_dkpanel_template());
                this._icon = shadowRoot.getElementById('icon');
                this._panel = shadowRoot.getElementById('panel');
                this._panel_title_text = shadowRoot.getElementById('title-text');
                this._slot = shadowRoot.getElementById('panel-content');
                this._slot_changed = false;

                this._slot.addEventListener('slotchange', () => this._on_slot_change());
            }

            _on_slot_change() {
                const add_body_panel = () => {
                    const panel_body = document.createElement('div');
                    panel_body.classList.add('panel-body');
                    this._panel.append(panel_body);
                    return panel_body;
                };

                if (!this._slot_changed) {  // this function is called twice..
                    this._slot_changed = true;

                    const header = this.querySelector('h1,h2,h3,h4,h5,h6');  // :header
                    this._panel_title_text.textContent = header.textContent;
                    const img = header.querySelector('img:first-child');
                    if (img) {
                        this._icon.append(img);
                    } else {
                        this._dkicon = icon(this._icon_open);
                        this._icon.append(this._dkicon);
                        // this._dkicon = dkicon.create_inside(this._icon, {value: this._icon_open});
                    }
                    this.removeChild(header);

                    let current_panel_body = null;
                    if (this.children.length === 0 && this.childNodes.length > 0) {  // only text nodes
                        current_panel_body = add_body_panel();
                        while (this.childNodes.length > 0) {
                            current_panel_body.appendChild(this.childNodes[0]);
                        }
                    }
                    while (this.children.length > 0) {
                        const child = this.children[0];
                        switch (child.tagName) {
                            case 'TABLE':
                            case 'UL':
                                this._panel.append(child);
                                current_panel_body = null;
                                break;
                            default:
                                if (!current_panel_body) current_panel_body = add_body_panel();
                                current_panel_body.append(child);
                        }
                    }
                }
            }
            
            connectedCallback() {
                const height_attr = this.getAttribute('height');
                this._height = height_attr ? parseInt(height_attr, 10) : this.clientHeight;
                if (this._height) this.setAttribute('height', this._height);
                
                const width_attr = this.getAttribute('width');
                this._width = height_attr ? parseInt(width_attr, 10) : this.clientWidth;
                if (this._width) this.setAttribute('width', this._width);

                this._collapsible = !!this.getAttribute('collapsible');
                this._status = this.getAttribute('status') || 'open';
                this.setAttribute('status', this._status);
            }
            
            static get observedAttributes() {
                return [
                    'height',
                    'width',
                    'collapsible',
                    'status',
                ];
            }

            get height() { return this._height; }
            get width() { return this._width; }
            get collapsible() { return this._collapsible; }
            get status() { return this._status; }
            
            collapse() {
                this._widget.collapse();
            }
            expand() {
                this._widget.expand();
            }
            get loaded() { return this._loaded; }
        });

    }
}
