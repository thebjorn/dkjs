
// var Widget = require('../../widgetcore/dk-widget.js');


import {Widget} from "../../widgetcore/dk-widget";
import {icon} from "../dk-icon-library";

export class SortDirection extends Widget {
    constructor(...args) {
        super({
            direction: '',  // asc/desc/''
            width: 20,
            structure: {
                classes: ['sort-icon'],
                css: { float: 'right' }
            }
        }, ...args);
        this.direction = '';
        this.width = this.width || 20;

    }
    
    construct() {
        this.widget().css({
            width: this.width,
            marginLeft: this.width
        });
    }

    set_direction(direction) {
        if (direction !== this.direction) {
            this.direction = direction;
            this.notify('sort', direction);
        }
    }

    clear_sort() {
        this.set_direction('');
        this.draw();
    }

    toggle_sort_direction() {
        this.set_direction({
            asc: 'desc',
            desc: 'asc',
            '': 'desc'
        }[this.direction]);
        this.draw();
    }

    handlers() {
        var self = this;
        self.widget().on('click', function () {
            self.toggle_sort_direction();
        });
    }

    draw() {
        this.widget().empty();
        switch (this.direction) {
            case 'asc':
                this.widget().append(icon('up'));
                break;
            case 'desc':
                this.widget().append(icon('down'));
                break;
        }
    }
}
