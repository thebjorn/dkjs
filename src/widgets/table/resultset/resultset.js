import dk from "../../../dk-obj";
import {Widget} from "../../../widgetcore/dk-widget";
import {SearchWidget} from "../../search-widget";
import {PagerWidget} from "../../pager-widget";
import {dkwarning} from "../../../lifecycle/coldboot/dkwarning";
import {dedent} from "../../../text/template-functions";
        

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
                            <span><img height="28" alt="csv" src="https://static.datakortet.no/ikn/ax/button_blue_down.png"></span>
                        </button>`,
                add:            '<img class="add-button" alt="add" height="28" src="https://static.datakortet.no/ikn/ax/button_blue_add.png">',
                commands:       '<div class="commands"/>'
            },
            
            command_buttons: {
                // default command parameters
                add: {
                    show: true,
                    url: '/',
                },
                csv: {
                    show: true,
                    filename: 'filename.csv',
                },
            }
            
        }, ...args);

        // XXX: make button/command handling less ugly...?
        const cmd_btns = this.command_buttons;
        const command_buttons = {
            // default command parameters
            add: {
                show: true,
                url: '/',
            },
            csv: {
                show: true,
                filename: 'filename.csv',
            },
        };
        if (cmd_btns.add === false) command_buttons.add.show = false;
        if (cmd_btns.add) command_buttons.add = dk.merge(command_buttons.add, cmd_btns.add);
        if (cmd_btns.csv === false) command_buttons.csv.show = false;
        if (cmd_btns.csv) command_buttons.csv = dk.merge(command_buttons.csv, cmd_btns.csv);
        this.command_buttons = command_buttons;
        if (cmd_btns.csv && cmd_btns.csv.filename && cmd_btns.csv.filename !== this.command_buttons.csv.filename) {
            this.command_buttons.csv.filename = cmd_btns.csv.filename;
        }

        if (!this.command_buttons.add.show || this.add_widget === false) delete this.structure.rowbx.data.header.commands.add;
        if (!this.command_buttons.csv.show || this.download_widget === false) delete this.structure.rowbx.data.header.commands.csv;
        
        if (!this.dataset) dkwarning(dedent`
            You should define .dataset on the Resultset (as opposed to inside the construct_table function):
            
                dk.ResultSet.create_on(.., {
                    dataset: dk.data.DataSet.create({
                        datasource: ...e.g. url...,
                        pagesize: 5,
                        orphans: 4
                    }),
                    construct_table: function (location, downloadwidget, ds) {
                        table_data: ds,
                        ...
                    }
                });
        `);
    }

    collapse_filter(size) {
        // dk.info("COLLAPSE_FILTER:", arguments, this.rowbx.filterbx, this.widget().width());
        // this.rowbx.filterbx.css('width', size.width);
        // dk.info("size:", size);
        // this.rowbx.filterbx.css('margin-right', -1 * size.height + size.width + 4);
        // dk.info("FILTERBX width:", this.rowbx.filterbx.width());
        // this.rowbx.data.css('width', '80%');
    }

    construct_filter(location, dataset) {
        this.filter = null;
        // override this method to attach a filter.  The default version removes the
        // filter box and stretches the data box to full width.
        location.css({
            marginRight: 0,
            paddingRight: 0,
            width: 0
        });
        return null;
    }

    // noinspection JSUnusedLocalSymbols
    construct_table(location, download, ds) {
        if (!this.table) {
            return this._construction_error("you need to specify a construct_table method");
        }
    }

    // Called automatically when structure.header.search have been created.
    // (because.. structure/layout/widget work together so any structure element `foo`,
    // will look for and call a corresponding `widget.construct_foo(location)` method...
    // yes, magic.)
    construct_search(location) {
        return SearchWidget.create_inside(location, {});
    }

    construct_pager(location, state) {
        // console.log("CONSTRUCTING_PAGER", location, state);
        this.pager = null;
        return PagerWidget.create_inside(location, state);
    }

    _construction_error(msg, type) {
        type = type || 'danger';
        this.widget().append(dk.$('<div/>').addClass('alert alert-' + type).html(msg));
    }

    construct() {
        // subwidget handlers
        if (this.dataset) dk.on(this.dataset, 'fetch-info', info => this._update_info(info));
        this.state = {}; //dk.page.hash.substate(this.id);
        this.header = this.rowbx.data.header;
        this.table = this.construct_table(
            this.rowbx.data.content, 
            this.widget('.excel'), 
            this.dataset
        );
        if (!this.table) return;
        if (this.command_buttons.csv.show && !this.table.download) {
            // we should show the csv download button, but construct_table has not initialized it...
            this.widget('.excelbtn').on('click', () => this.table.table_data.fetch_csv(this.command_buttons.csv.filename)); 
        }
        if (this.command_buttons.add.show) {
            this.widget('.add-button').on('click', () => location.assign(this.command_buttons.add.url));
        }
        // console.log("Resultset:construct:end:construct_table");
        
        this.filter = this.construct_filter(this.rowbx.filterbx, this.table.table_data);
        this.pager = this.construct_pager(this.rowbx.data.footer, {});
        this.table.set_pager(this.pager);
    }
    
    _update_info(info) {
        // console.log("ResultSet:handler:_update_info:", info);
        let count = 'many';
        const start_recnum = info.start_recnum || 0;
        const end_recnum = info.end_recnum || 0;
        const filter_count = info.filter_count || 0;
        const totcount = info.totcount || 0;

        if (end_recnum - start_recnum === 0) count = 'none';
        if (end_recnum - start_recnum === 1) count = 'one';

        let infotxt = '<span class="info">';
        const total = `<span class="tot">(totalt: ${totcount})</span>`;
        // console.log("SWITCH:", count, info);

        switch (count) {
            case 'none':
                infotxt += `viser 0 av ${filter_count}`;
                break;
            case 'one':
                infotxt += `post nr. ${start_recnum} av ${filter_count}`;
                break;
            case 'many':
                infotxt += `viser ${start_recnum}&ndash;${end_recnum-1} av ${filter_count}`;
                break;
        }
        infotxt += '</span>';

        this.header.stats.html(infotxt + total);
    }
    
    handlers() {
        // console.info("DECLARING Resultset.handlers()");
        if (this.filter)   dk.on(this.filter, 'collapse-done', () => this.collapse_filter());
        if (!this.dataset) dk.on(this.table.table_data, 'fetch-info', info => this._update_info(info));

        dk.on(this.table.table_data, 'fetch-data-start', () => this.start_busy());
        dk.on(this.table.table_data, 'fetch-data', () => this.end_busy());

        // FIXME: this assumes that this.filter is a panel that has a .datafilter attribute that 
        //        is a widgets/filter/data-filter.js:DataFilter instance
        if (this.filter) {
            dk.on(this.filter.datafilter, 'filter-change', filtervals => this.table.table_data.set_filter(filtervals));
        }
        dk.on(this.table.table_data, 'fetch-page', () => this.pager.draw());
        dk.on(this.header.search, 'search', (terms) => this.table.set_search(terms));
        dk.on(this.header.search, 'clear', () => this.table.set_search());
    }

}
