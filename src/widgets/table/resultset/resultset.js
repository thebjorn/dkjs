import dk from "../../../dk-obj";
import {Widget} from "../../../widgetcore/dk-widget";
import {SearchWidget} from "../../search-widget";
import {PagerWidget} from "../../pager-widget";


export class ResultSet extends Widget {
    constructor(...args) {
        super({
            // type: 'resultset',

            filter_size: 20,     // percent

            structure: {
                classes: ['clearfix'],
                rowbx: {
                    css: {
                        display: 'flex',
                        alignItems: 'flex-start'
                    },
                    filterbx: {
                        css: {
                            marginRight: 4,
                            width: 180
                            // flex: '0 0 180px'
                            // float: 'left'
                        }
                    },
                    data: {
                        classes: ['panel', 'panel-default'],
                        css: {
                            flex: 1
                            //float: 'right'
                        },
                        header: {
                            classes: ['panel-heading', 'clearfix'],
                            search: {
                                classes: ['pull-left'],
                                css: {
                                    width: '40%'
                                }
                            },
                            commands: {
                                classes: ['pull-right'],
                                add: {},
                                csv: {}
                            },
                            stats: {
                                template: '<div/>',
                                classes: ['pull-right'],
                                css: {textAlign: 'right', marginRight: '1ex'}
                            }
                        },
                        content: {
                            query: '.result-table',
                            template: '<table/>',
                            classes: ['result-table', 'table', 'table-bordered', 'table-hover', 'table-condensed']
                        },
                        footer:  {
                            template: '<footer/>',
                            classes: ['panel-footer']
                        }
                    }
                }
            },
            template: {
                root: 'section',
                search:         '<div/>',
                csv:   `<button class="btn excelbtn" data-loading-text="Laster ned...">
                            <span><img height="28" alt="csv" src="//static.datakortet.no/ikn/ax/button_blue_down.png"></span>
                        </button>`,
                add:            '<img class="add-button" alt="add" height="28" src="//static.datakortet.no/ikn/ax/button_blue_add.png">',
                commands:       '<div class="commands"/>'
            },
            
        }, ...args);
    }

    collapse_filter(size) {
        // dk.info("COLLAPSE_FILTER:", arguments, this.rowbx.filterbx, this.widget().width());
        // this.rowbx.filterbx.css('width', size.width);
        // dk.info("size:", size);
        // this.rowbx.filterbx.css('margin-right', -1 * size.height + size.width + 4);
        // dk.info("FILTERBX width:", this.rowbx.filterbx.width());
        // this.rowbx.data.css('width', '80%');
    }

    construct_filter(location) {  //}, dataset) {
        this.filter = null;
        // override this method to atttach a filter.  The default version removes the
        // filter box and stretches the data box to full width.
        location.css({
            paddingRight: 0,
            width: 0
        });
        return null;
    }

    // noinspection JSUnusedLocalSymbols
    construct_table(location, download) {
        if (!this.table) {
            return this._construction_error("you need to specify a construct_table method");
        }
    }

    // called automatically when structure.header.search have been created.
    construct_search(location) {
        return SearchWidget.create_inside(location, {});
    }

    construct_pager(location, state) {
        this.pager = null;
        return PagerWidget.create_inside(location, state);
    }

    _construction_error(msg, type) {
        type = type || 'danger';
        this.widget().append(dk.$('<div/>').addClass('alert alert-' + type).html(msg));
    }

    construct() {
        this.state = {}; //dk.page.hash.substate(this.id);
        this.table = this.construct_table(this.rowbx.data.content, this.widget('.excel'));
        if (!this.table) return;

        //this.filter = this.construct_filter(this.rowbx.filterbx, this.table);
        this.filter = this.construct_filter(this.rowbx.filterbx, this.table.table_data);
        // if (this.filter) this.filter.data = this.table.table_data;  // connect filter widget to data-set.

        this.pager = this.construct_pager(this.rowbx.data.footer, {});
        this.table.set_pager(this.pager);

        this.header = this.rowbx.data.header;

        //if (this.rowbx.filterbx.is(':empty')) {
        //    this.rowbx.data.css('width', '100%');
        //} else {
        //    this.rowbx.css({display: 'flex'});
        //    this.rowbx.filterbx.css({
        //        width: this.filter_size + "%",
        //        paddingRight: 4
        //    });
        //    this.rowbx.data.css('width',  (100 - this.filter_size) + "%");
        //}
    }
    handlers() {
        if (this.filter) dk.on(this.filter, 'collapse-done', () => this.collapse_filter());

        dk.on(this.table.table_data, 'fetch-info', info => {
            let count = 'many';
            const start_recnum = info.start_recnum || 1;
            const end_recnum = info.end_recnum || 1;
            const filter_count = info.filter_count || 0;
            const totcount = info.totcount || 0;

            if (end_recnum - start_recnum === 0) count = 'none';
            if (end_recnum - start_recnum === 1) count = 'one';

            let infotxt = '<span class="info">';
            const total = `<span class="tot">(totalt: ${totcount})</span>`;

            switch (count) {
                case 'none':
                    infotxt += `viser 0 av ${filter_count}`;
                    break;
                case 'one':
                    if (start_recnum === 1) {
                        infotxt += `viser 1 av ${filter_count}`;
                    } else {
                        infotxt += `post nr. ${start_recnum} av ${filter_count}`;
                    }
                    break;
                case 'many':
                    infotxt += `viser ${start_recnum}&ndash;${end_recnum-1} av ${filter_count}`;
                    break;
            }
            infotxt += '</span>';

            this.header.stats.html(infotxt + total);
        });


        dk.on(this.table.table_data, 'fetch-data-start', () => this.start_busy());
        dk.on(this.table.table_data, 'fetch-data', () => this.end_busy());

        if (this.filter) {
            dk.on(this.filter.datafilter, 'filter-change', filtervals => this.table.table_data.set_filter(filtervals));
        }
        dk.on(this.table.table_data, 'fetch-page', () => this.pager.draw());
        dk.on(this.header.search, 'search', () => this.table.set_search());
        dk.on(this.header.search, 'clear', () => this.table.set_search());
    }

}
