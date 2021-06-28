
import Class from "../../lifecycle/coldboot/dk-class";
import dk from "../../dk-obj";
import {value as format_value} from "../../data/datacore/dk-format"
import widgetmap from "../../widgetcore/dk-widgetmap";
import {TextInputWidget} from "../../forms/widgets";


export class ColumnDef extends Class {
    constructor(...args) {
        super({
            isa:         'dk.table.ColumnDef',
            name:        '',                        // name of column (eg. for computed cols)
            field:       '',                        // field definition {name:.., pos:.., string:..,...}
            label:       '',                        // text to put in th element
            sortable:    undefined,                 // sortable override
            description: '',                        // description
            align:       undefined,                 // cell alignment
            format:      format_value,  // formatting function
            type:        undefined,                 // data type of column values
            widget_type: TextInputWidget,     // widget to use when editing a cell value
            empty:       '',                        // value to use for empty cells
            table:       undefined,                 // the DataTable (subclass) we belong to
            _alignment_map: {
                int: 'right'
            }
        }, ...args);
        this.name = this.name || this.field;
    }

    alignment() {
        return this.align || this._alignment_map[this.type] || 'left';
    }

    get_value(record) {
        //dk.info("getting value from columndef", record, this, record[this.name]);
        if(record)
            return record[this.name];
    }

    /*
     *  Update self with info from the datasource.
     */
    bind_to_field(field) {
        this.field = field;
        if (!this.label) this.label = field.label || field.name;
        if (!this.type) this.type = field.type;

        let wtype;
        if (field.widget) {
            // wtype = widgetmap.get(field.widget);
            wtype = widgetmap[field.widget];
        } else {
            wtype = widgetmap[this.type];
        }

        if (wtype === undefined) {
            // dk.warn("Unknown widget: ", field.widget, field);
            wtype = TextInputWidget;
        }
        this.widget_type = wtype;
        this.widget_data = field.data;
        this.widget_url = field.url;
    }
}
