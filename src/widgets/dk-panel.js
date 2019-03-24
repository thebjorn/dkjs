
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

if (typeof customElements !== 'undefined') customElements.define('dk-panel', class extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(get_dkpanel_template());
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
            if (img) this._icon.append(img);
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
    
    connectedCallback() {}
    
    collapse() {
        this._widget.collapse();
    }
    expand() {
        this._widget.expand();
    }
    get loaded() { return this._loaded; }
});
