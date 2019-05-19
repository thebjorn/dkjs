
import dk from "../dk-obj";
import {DataPage} from "./dk-datapage";
import Class from "../lifecycle/coldboot/dk-class";
import {DataQuery} from "./dk-dataquery";
import {ArraySource} from "./source/dk-array-datasource";
import {is_ajax_url} from "../lifecycle/uri";
import {AjaxDataSource} from "./source/dk-ajax-datasource";


/*
 *  A DataSet is an abstract paged collection of data items.
 *
 *  A DataSet can provide a conrete DataPage (i.e. a list of
 *  records to be displayed).
 *
 *  The purpose of a DataSet is to provide such
 *  a DataPage by querying the underlying data source.
 *
 *  DataSet -> DataPage -> (data) Record -> (data) Field) -> (data) FieldValue
 */
export class DataSet extends Class {
    constructor(props) {
        if (props == null) props = {};
        if (Array.isArray(props.datasource)) props.datasource = new ArraySource(props.datasource);
        if (is_ajax_url(props.datasource)) props.datasource = new AjaxDataSource({url: props.datasource});
        super(Object.assign({
            // type: 'dk.data.Data',
            datasource: null,
            pages: null,            // dict[query -> page]
            page: null,             // current page

            pagenum: 0,             // current page number
            totpages: 0,            // total number of pages

            pagesize: 25,
            orphans: 0,
            
        }, props));
    
        this._first_fetch = true;
        this.pages = {};
        this._filter_data = {};
    }

    // synchronize dirty elements on page to datasource.
    update() {
        this.pages = {};  // clear cache
        this.page.update(this.datasource, this.FN('_new_recordset'));
        // this.page.update(this.datasource, function (recordset) {
        //     self._new_recordset(self._get_records(null, recordset));
        // });
    }

    /**
     * Gets the current state
     * @param query  - a DataQuery instance
     * @returns {*}  - a DataQuery instance
     */
    get_state(query) {
        if (!this.datasource.url) return query;
        return DataQuery.create(dk.hash.get(this.datasource.url, query.copy()), this);
    }

    set_state(query) {
        if (this.datasource.url) {
            dk.hash[this.datasource.url] = query.copy();
        }
    }
    
    /**
     * _new_recordset is the callback handler for this.datasource.get_records().
     * 
     * @param recordset
     * @param query
     * @private
     */
    _new_recordset(recordset, query) {
        const page = DataPage.create({
            query: query,
            recordset: recordset
        });
        if (recordset.meta) {
            const m = recordset.meta;
            //dk.dir('query', query);
            if (m.totcount === undefined && m.filter_count === undefined) {
                m.totcount = 0;
                m.filter_count = 0;
            }
            if (m.totcount && m.filter_count === undefined) m.filter_count = m.totcount;
            if (m.pagecount === undefined && m.filter_count === 0) {
                m.pagecount = 0;
            } else if (m.filter_count !== undefined && !m.pagecount) {
                m.pagecount = Math.max(1, Math.floor(m.filter_count / query.pagesize));
                if (m.filter_count > query.pagesize && m.filter_count % query.pagesize > query.orphans) {
                    ++m.pagecount;
                }
            }
        }
        dk.on(page, 'dirty', (...args) => this.update(...args));
        this.page = this.pages[query] = page;
        dk.trigger(this, 'fetch-info', page.recordset.meta, query);
        dk.trigger(this, 'fetch-data', this, page);
    }

    get_page(query) {
        query = DataQuery.create(query, this);
        // console.info("DATASET:GET:PAGE:QUERY:", this._first_fetch, query);
        if (this._first_fetch) {
            query = this.get_state(query);
            this._first_fetch = false;
        } else {
            this.set_state(query);
        }
        // console.info("DATASET:GET:PAGE:QUERY:2", this._first_fetch, query);
        
        // dk.dir("GET-PAGE:", query.copy());
        dk.trigger(this, 'fetch-data-start');

        if (!this.pages[query]) {
            // this.datasource.get_records(query, this.FN('_new_recordset'));
            this.datasource.get_records(query, recordset => {
                this._new_recordset(recordset, query);
            });
        } else {
            dk.info("GET-PAGE... cached!");
            this.page = this.pages[query];
            dk.trigger(this, 'fetch-info', this.page.recordset.meta, query);
            dk.trigger(this, 'fetch-data', this, this.page);
        }
    }

    _current_query() {
        if (this.page) return this.page.query.copy();
        return {};
    }

    /*
     *  Fetch page number `n` (zero-based).
     */
    get_pagenum(n) {
        const query = this._current_query();
        query.pagenum = n;
        this.get_page(query);
    }

    set_search(terms) {
        const query = this._current_query();
        query.search = terms;
        query.pagenum = 0;
        this.get_page(query);
    }

    set_sort(fieldname, direction) {
        const query = this._current_query();
        const newsort = {field: fieldname, direction: direction};
        query.sort = [newsort];
        query.pagenum = 0;
        this.get_page(query);
    }

    get_filter_data(filter_name, returns) {
        // get data needed to display filter with name `filter_name`
        if (this._filter_data[filter_name]) {
            returns(this._filter_data[filter_name]);
        } else {
            this.datasource.get_filter_data(filter_name, opts => {
                returns(opts);
            });
        }
    }

    set_filter(vals) {
        const query = this._current_query();
        query.filter = vals;
        query.pagenum = 0;
        this.get_page(query);
    }

    fetch_csv(filename) {
        let query = this._current_query();
        query.pagesize = 50000;
        query = DataQuery.create(query, this);
        if (dk.$('#downloadFile').length) {
            dk.$('#downloadFile').remove();
        }
        const url = this.datasource.url+"!get-records?fmt=csv&filename="+ filename + '&' + query.toGetParams();
        dk.$('<a></a>')
            .attr('id','downloadFile')
            .attr('href',url)
            .attr('target', '_blank')
            .appendTo('body');
        dk.$('#downloadFile').ready(function() {
            dk.$('#downloadFile').get(0).click();
        });
    }
}
