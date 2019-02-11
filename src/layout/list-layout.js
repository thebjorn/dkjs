
import {Layout} from "./dk-layout";


export class ListLayout extends Layout {
    constructor(widget, location, template, structure) {
        super(widget, location, template, structure);
        this.class_name = 'dk-list';
    }

    add_li() {
        const li = this.make('li');
        this.appendln(li);
        return li;
    }
}

