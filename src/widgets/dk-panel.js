
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
if (typeof customElements !== 'undefined') customElements.define('dk-panel', class extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({mode: 'open'});
        const template = document.createElement('template');
        template.innerHTML = `
            <style>
.panel {
  margin-bottom: 20px;
  background-color: #fff;
  border: 1px solid transparent;
  border-radius: 4px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
}

.panel-body {
  padding: 15px;
}
.panel-body:before, .panel-body:after {
  content: " ";
  display: table;
}
.panel-body:after {
  clear: both;
}

.panel-heading {
  padding: 10px 15px;
  border-bottom: 1px solid transparent;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
}
.panel-heading > .dropdown .dropdown-toggle {
  color: inherit;
}

.panel-title {
  margin-top: 0;
  margin-bottom: 0;
  font-size: 16px;
  color: inherit;
}
.panel-title > a,
.panel-title > small,
.panel-title > .small,
.panel-title > small > a,
.panel-title > .small > a {
  color: inherit;
}

.panel-footer {
  padding: 10px 15px;
  background-color: #f5f5f5;
  border-top: 1px solid #ddd;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
}

.panel > .list-group,
.panel > .panel-collapse > .list-group {
  margin-bottom: 0;
}
.panel > .list-group .list-group-item,
.panel > .panel-collapse > .list-group .list-group-item {
  border-width: 1px 0;
  border-radius: 0;
}
.panel > .list-group:first-child .list-group-item:first-child,
.panel > .panel-collapse > .list-group:first-child .list-group-item:first-child {
  border-top: 0;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
}
.panel > .list-group:last-child .list-group-item:last-child,
.panel > .panel-collapse > .list-group:last-child .list-group-item:last-child {
  border-bottom: 0;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
}
.panel > .panel-heading + .panel-collapse > .list-group .list-group-item:first-child {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.panel-heading + .list-group .list-group-item:first-child {
  border-top-width: 0;
}

.list-group + .panel-footer {
  border-top-width: 0;
}

.panel > .table,
.panel > .table-responsive > .table,
.panel > .panel-collapse > .table {
  margin-bottom: 0;
}
.panel > .table caption,
.panel > .table-responsive > .table caption,
.panel > .panel-collapse > .table caption {
  padding-left: 15px;
  padding-right: 15px;
}
.panel > .table:first-child,
.panel > .table-responsive:first-child > .table:first-child {
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
}
.panel > .table:first-child > thead:first-child > tr:first-child,
.panel > .table:first-child > tbody:first-child > tr:first-child,
.panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child,
.panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child {
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
}
.panel > .table:first-child > thead:first-child > tr:first-child td:first-child,
.panel > .table:first-child > thead:first-child > tr:first-child th:first-child,
.panel > .table:first-child > tbody:first-child > tr:first-child td:first-child,
.panel > .table:first-child > tbody:first-child > tr:first-child th:first-child,
.panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child td:first-child,
.panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child th:first-child,
.panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child td:first-child,
.panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child th:first-child {
  border-top-left-radius: 3px;
}
.panel > .table:first-child > thead:first-child > tr:first-child td:last-child,
.panel > .table:first-child > thead:first-child > tr:first-child th:last-child,
.panel > .table:first-child > tbody:first-child > tr:first-child td:last-child,
.panel > .table:first-child > tbody:first-child > tr:first-child th:last-child,
.panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child td:last-child,
.panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child th:last-child,
.panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child td:last-child,
.panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child th:last-child {
  border-top-right-radius: 3px;
}
.panel > .table:last-child,
.panel > .table-responsive:last-child > .table:last-child {
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
}
.panel > .table:last-child > tbody:last-child > tr:last-child,
.panel > .table:last-child > tfoot:last-child > tr:last-child,
.panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child,
.panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child {
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
}
.panel > .table:last-child > tbody:last-child > tr:last-child td:first-child,
.panel > .table:last-child > tbody:last-child > tr:last-child th:first-child,
.panel > .table:last-child > tfoot:last-child > tr:last-child td:first-child,
.panel > .table:last-child > tfoot:last-child > tr:last-child th:first-child,
.panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child td:first-child,
.panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child th:first-child,
.panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child td:first-child,
.panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child th:first-child {
  border-bottom-left-radius: 3px;
}
.panel > .table:last-child > tbody:last-child > tr:last-child td:last-child,
.panel > .table:last-child > tbody:last-child > tr:last-child th:last-child,
.panel > .table:last-child > tfoot:last-child > tr:last-child td:last-child,
.panel > .table:last-child > tfoot:last-child > tr:last-child th:last-child,
.panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child td:last-child,
.panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child th:last-child,
.panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child td:last-child,
.panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child th:last-child {
  border-bottom-right-radius: 3px;
}
.panel > .panel-body + .table,
.panel > .panel-body + .table-responsive,
.panel > .table + .panel-body,
.panel > .table-responsive + .panel-body {
  border-top: 1px solid #ddd;
}
.panel > .table > tbody:first-child > tr:first-child th,
.panel > .table > tbody:first-child > tr:first-child td {
  border-top: 0;
}
.panel > .table-bordered,
.panel > .table-responsive > .table-bordered {
  border: 0;
}
.panel > .table-bordered > thead > tr > th:first-child,
.panel > .table-bordered > thead > tr > td:first-child,
.panel > .table-bordered > tbody > tr > th:first-child,
.panel > .table-bordered > tbody > tr > td:first-child,
.panel > .table-bordered > tfoot > tr > th:first-child,
.panel > .table-bordered > tfoot > tr > td:first-child,
.panel > .table-responsive > .table-bordered > thead > tr > th:first-child,
.panel > .table-responsive > .table-bordered > thead > tr > td:first-child,
.panel > .table-responsive > .table-bordered > tbody > tr > th:first-child,
.panel > .table-responsive > .table-bordered > tbody > tr > td:first-child,
.panel > .table-responsive > .table-bordered > tfoot > tr > th:first-child,
.panel > .table-responsive > .table-bordered > tfoot > tr > td:first-child {
  border-left: 0;
}
.panel > .table-bordered > thead > tr > th:last-child,
.panel > .table-bordered > thead > tr > td:last-child,
.panel > .table-bordered > tbody > tr > th:last-child,
.panel > .table-bordered > tbody > tr > td:last-child,
.panel > .table-bordered > tfoot > tr > th:last-child,
.panel > .table-bordered > tfoot > tr > td:last-child,
.panel > .table-responsive > .table-bordered > thead > tr > th:last-child,
.panel > .table-responsive > .table-bordered > thead > tr > td:last-child,
.panel > .table-responsive > .table-bordered > tbody > tr > th:last-child,
.panel > .table-responsive > .table-bordered > tbody > tr > td:last-child,
.panel > .table-responsive > .table-bordered > tfoot > tr > th:last-child,
.panel > .table-responsive > .table-bordered > tfoot > tr > td:last-child {
  border-right: 0;
}
.panel > .table-bordered > thead > tr:first-child > td,
.panel > .table-bordered > thead > tr:first-child > th,
.panel > .table-bordered > tbody > tr:first-child > td,
.panel > .table-bordered > tbody > tr:first-child > th,
.panel > .table-responsive > .table-bordered > thead > tr:first-child > td,
.panel > .table-responsive > .table-bordered > thead > tr:first-child > th,
.panel > .table-responsive > .table-bordered > tbody > tr:first-child > td,
.panel > .table-responsive > .table-bordered > tbody > tr:first-child > th {
  border-bottom: 0;
}
.panel > .table-bordered > tbody > tr:last-child > td,
.panel > .table-bordered > tbody > tr:last-child > th,
.panel > .table-bordered > tfoot > tr:last-child > td,
.panel > .table-bordered > tfoot > tr:last-child > th,
.panel > .table-responsive > .table-bordered > tbody > tr:last-child > td,
.panel > .table-responsive > .table-bordered > tbody > tr:last-child > th,
.panel > .table-responsive > .table-bordered > tfoot > tr:last-child > td,
.panel > .table-responsive > .table-bordered > tfoot > tr:last-child > th {
  border-bottom: 0;
}
.panel > .table-responsive {
  border: 0;
  margin-bottom: 0;
}

.panel-default {
  border-color: #ddd;
}
.panel-default > .panel-heading {
  color: #333333;
  background-color: #f5f5f5;
  border-color: #ddd;
}
.panel-default > .panel-heading + .panel-collapse > .panel-body {
  border-top-color: #ddd;
}
.panel-default > .panel-heading .badge {
  color: #f5f5f5;
  background-color: #333333;
}
.panel-default > .panel-footer + .panel-collapse > .panel-body {
  border-bottom-color: #ddd;
}

.panel-primary {
  border-color: #337ab7;
}
.panel-primary > .panel-heading {
  color: #fff;
  background-color: #337ab7;
  border-color: #337ab7;
}
.panel-primary > .panel-heading + .panel-collapse > .panel-body {
  border-top-color: #337ab7;
}
.panel-primary > .panel-heading .badge {
  color: #337ab7;
  background-color: #fff;
}
.panel-primary > .panel-footer + .panel-collapse > .panel-body {
  border-bottom-color: #337ab7;
}

.panel-success {
  border-color: #d6e9c6;
}
.panel-success > .panel-heading {
  color: #3c763d;
  background-color: #dff0d8;
  border-color: #d6e9c6;
}
.panel-success > .panel-heading + .panel-collapse > .panel-body {
  border-top-color: #d6e9c6;
}
.panel-success > .panel-heading .badge {
  color: #dff0d8;
  background-color: #3c763d;
}
.panel-success > .panel-footer + .panel-collapse > .panel-body {
  border-bottom-color: #d6e9c6;
}

.panel-info {
  border-color: #bce8f1;
}
.panel-info > .panel-heading {
  color: #31708f;
  background-color: #d9edf7;
  border-color: #bce8f1;
}
.panel-info > .panel-heading + .panel-collapse > .panel-body {
  border-top-color: #bce8f1;
}
.panel-info > .panel-heading .badge {
  color: #d9edf7;
  background-color: #31708f;
}
.panel-info > .panel-footer + .panel-collapse > .panel-body {
  border-bottom-color: #bce8f1;
}

.panel-warning {
  border-color: #faebcc;
}
.panel-warning > .panel-heading {
  color: #8a6d3b;
  background-color: #fcf8e3;
  border-color: #faebcc;
}
.panel-warning > .panel-heading + .panel-collapse > .panel-body {
  border-top-color: #faebcc;
}
.panel-warning > .panel-heading .badge {
  color: #fcf8e3;
  background-color: #8a6d3b;
}
.panel-warning > .panel-footer + .panel-collapse > .panel-body {
  border-bottom-color: #faebcc;
}

.panel-danger {
  border-color: #ebccd1;
}
.panel-danger > .panel-heading {
  color: #a94442;
  background-color: #f2dede;
  border-color: #ebccd1;
}
.panel-danger > .panel-heading + .panel-collapse > .panel-body {
  border-top-color: #ebccd1;
}
.panel-danger > .panel-heading .badge {
  color: #f2dede;
  background-color: #a94442;
}
.panel-danger > .panel-footer + .panel-collapse > .panel-body {
  border-bottom-color: #ebccd1;
}            
            </style>
            <div id="panel" class="panel panel-default">
                <header class="panel-heading">
                    <div id="panel-title" class="panel-title">
                    </div>
                </header>
                <div id="panel-body" class="panel-body">
                </div>

                <slot id="panel-content"></slot>
            </div>
        `;
        shadowRoot.appendChild(template.content.cloneNode(true));
        this._slot = shadowRoot.querySelector('slot');
        this._slot.addEventListener('slotchange', () => this._on_slot_change());
        this._changed = false;
    }
    
    _on_slot_change() {
        if (this._changed || this.shadowRoot.querySelector('slot').assignedElements() < 2) return;
        this._changed = true;
        const elements = this.shadowRoot.querySelector('slot').assignedElements();
        const header = elements[0];
        const body = elements[1];
        this.shadowRoot.querySelector('#panel-title').append(header.textContent);
        this.removeChild(header);
        this.shadowRoot.querySelector('#panel-body').append(body);
        // console.log("changlling the slot", this.shadowRoot.querySelector('#panel-content'));
    }
    
    connectedCallback() {
        // debugger;
        console.log('this children?', this.hasChildNodes());
        console.log("has children:", this.shadowRoot.querySelector('#panel-title'));
        const content = this.shadowRoot.querySelector('#panel-content');
        console.log("has children:", content);
        console.log('content children', content.children);
        console.log("h3:", dk.$('h3'));
        // PanelWidget.create_on(dk.$(this).find('#panel-content'), {
        //     title: 'foo bar'
        // });
        // this.innerHTML = `
        //     <div class="panel panel-default">
        //         <header class="panel-heading">
        //             <div class="panel-title">
        //                 <slot name="title"></slot>
        //             </div>
        //         </header>
        //         <div class="panel-body"><slot name="body"></slot></div>
        //     </div>
        // `;
        // this.classList.add('panel');
        // this.classList.add('panel-default');
        // console.log("INNERHTML:", this.innerHTML);
        // this._loaded = false;
        // this.style.display = 'block';
        // const header = this.querySelector('h1,h2,h3,h4,h5,h6');
        // console.log("DKPANEL:", header);
        // const $header = dk.$(this).find('>h3:first-child');
        // const $img = $header.find('>img:first-child');
        // $header.detach();

        // dk.$(this).wrapInner('<div class="panel-body"/>');

        // this._widget = PanelWidget.create_on(dk.$(this), {
        //     title: $header.text()
        // });
        // try {
        //     this._widget.footer.hide();
        // } catch (e) {}
        //
        // if ($img.length && this._widget.header) {
        //     this._widget.header.title.collapseicon.empty().append($img);
        // }
        // try {
        //     const htext = this._widget.header.title.headingtext;
        //     htext.addClass($header.attr('class'));
        //     htext.css({
        //         fontSize: $header.css('fontSize'),
        //         lineHeight: $header.css('lineHeight')
        //     });
        // } catch (e) {}
        // this._loaded = true;
        // dk.$(this).trigger('loaded');
    }
    collapse() {
        this._widget.collapse();
    }
    expand() {
        this._widget.expand();
    }
    get loaded() { return this._loaded; }
});
