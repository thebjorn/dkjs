import {AjaxDataSource} from "./dk-ajax-datasource";
// import $ from 'jquery';
import Pusher from 'pusher-js';
import {ArraySource} from "./dk-array-datasource";
import dk from '../../dk-obj';

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
            dk.trigger(this, 'update-record', data.id, data.fields);
        });
        this.channel.bind('reload-record', data  => {
            dk.trigger(this, 'reload-record', data.id);
        });
        this.channel.bind('reload', data  => {
            dk.trigger(this, 'reload-all', data);
        });
    }
}
