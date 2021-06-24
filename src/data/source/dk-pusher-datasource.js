import {AjaxDataSource} from "./dk-ajax-datasource";
// import $ from 'jquery';
import Pusher from 'pusher-js';
import {ArraySource} from "./dk-array-datasource";
import dk from '../../dk-obj'

// This datasource support fetching data from Pusher.
export class PusherDataSource extends AjaxDataSource {
// export class PusherDataSource extends ArraySource {
    constructor(props) {
        // super([
        //     {username: 'hello', age: 42},
        //     {username: 'hello2', age: 43},
        // ]);
        super();
        props = Object.assign({}, props || {});
        this.datasource_url = props.url;
        this.pusher_channel = props.pusher_channel;
        this.pusher_key = props.pusher_key;
        this._fields = null;
        this.default_pagesize = props.default_pagesize || 5;
        const pusher = new Pusher(this.pusher_key, {
            cluster: 'eu'
        });
        this.channel = pusher.subscribe(this.pusher_channel);
        
        /*
            The update field message has the following format:
    
                 {
                    'id': 233332
                    'fields': [
                        {
                            'fieldname': 'status',
                            'value': 'logged-in'
                        }*
                    ]
                }
         */
        this.channel.bind('change', data  => {
            dk.trigger(this, 'update-record', data.id, data.fields)
        });
        // this.channel.bind('new', data  => this.trigger('reload-all', data));
        // this.channel.bind('delete', data  => this.trigger('delete-record', data));
        // this.channel.bind('reload', data  => this.trigger('reload-all', data));
        // this.channel.bind('reload_record', data  => this.trigger('update-record', data));
    }
    set live_data(val) {
        this.channel.bind('new', data  => this.on_new_event(data));
        // this.channel.bind('change', data  => this.on_change_event(data));
        this.channel.bind('delete', data  => this.on_delete_event(data));
        this.channel.bind('reload', data  => this.reload_table_data());
        this.channel.bind('reload_record', data  => this.on_reload_record(data));
    }
    
    reload_table_data() {
        // this.caller is set in ResultSet.construct
        this.caller.table.table_data.pages = {};
        this.caller.table.table_data.get_page();
    }
    
    // change_fields(data) {
    //     // For now, we only update one field.
    //     // to-do: Loop through changed elements.
    //     // to-do: Surely there is an easier way of doing this?
    //     const record = this.caller.table.table_data.get_record(data['id']);
    //     const row = this.caller.table.rows[record.rownum];
    //     const _row = $('#' + row.id);
    //     data['fields'].forEach(field => {
    //         const column = this.caller.table.column[field['fieldname']];
    //         const cell = $("#" + row.cells[column.colnum].id);
    //         cell.text(field['value']);
    //     });
    //    
    //     // animate the record change
    //     // fade-in
    //     _row.addClass('record_change');         
    //     setTimeout(function() {
    //         // fade-out
    //         _row.addClass('record_change_done');
    //     }, 1000);
    //    
    //     setTimeout(function() {
    //         _row.removeClass('record_change');
    //         _row.removeClass('record_change_done');
    //     }, 2000);
    // }
    
    // Change these functions if we want to do something else than just to 
    // reload the datasource.
    
    // One thing we should implement is to have different animation-effects
    // for the different events. 
    // ref: https://pusher.com/tutorials/realtime-table-datatables/#setting-up-datatables
    
    // PS! Reloading the datasource executes generates db-hits, so updating the 
    // fields directly using the incoming data, is the way to go except when
    // reloading using a scheduled job (because of non-trigger updates ie. 
    // time-based updates).
    
    on_new_event(data) {
        this.reload_table_data();
    }
    on_change_event(data) {
        this.change_fields(data);
    }
    on_delete_event(data) {
        this.reload_table_data();
    }
    on_reload_record(data) {
        
    }
}
