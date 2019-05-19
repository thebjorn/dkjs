
import Class from "../lifecycle/coldboot/dk-class";
import is from "../is";


export class DataQuery extends Class {
    constructor(page_query, dataset) {
        super();
        const q = page_query || {};
        this.pagesize = 25;
        if (q.pagesize != null) {
            this.pagesize = q.pagesize;
        } else if (dataset && dataset.pagesize != null) {
            this.pagesize = dataset.pagesize;
        } else if (dataset && dataset.datasource && dataset.datasource.default_pagesize != null) {
            this.pagesize = dataset.datasource.default_pagesize;
        }
        this.pagenum = q.pagenum || 0;
        this.start = this.pagenum * this.pagesize;
        this.end = this.start + this.pagesize;
        this.orphans = 0;
        if (q.orphans != null) {
            this.orphans = q.orphans;
        } else if (dataset && dataset.orphans != null) {
            this.orphans = dataset.orphans;
        }
        this.search = q.search || "";
        this.sort = q.sort || [];
        this.filter = q.filter || {};
    }

    copy() {
        return {
            pagesize: this.pagesize,
            pagenum: this.pagenum,
            start: this.start,
            end: this.end,
            orphans: this.orphans,
            search: this.search,
            sort: this.sort,
            filter: this.filter
        };
    }

    // must define toString so this class can be used as keys in a dict.
    toString() {
        return JSON.stringify({
            start: this.start,
            end: this.end,
            orphans: this.orphans,
            sort: this.sort,
            search: this.search,
            filter: this.filter
        });
    }
    
    axdata2page_query(axdata) {
        const res = {
            start: axdata.start || 0,
            search: axdata.q,
            filter: axdata.ft,
            end: axdata.end
        };
        if (axdata.s) {
            res.sort = axdata.s.split(',').map(sitem => {
                if (sitem[0] === '-') {
                    return {direction: 'desc', field:sitem.slice(1)};
                } else {
                    return {direction: 'asc', field:sitem};
                }
            });
        }
        return res;
    }

    _axdata() {
        // FIXME: duplicated in AjaxDataSource._axdata
        const sortcol = function (sitem) {
            if (sitem.field === undefined) return '';
            return (sitem.direction === 'desc' ? '-' : '') + sitem.field;
        };
        const data = {
            s: this.sort.map(sortcol).join(','),
            start: this.start,
            q: this.search,
            end: this.end,
            ft: this.filter
        };
        if (data.s === "") delete data.s;
        if (data.start === 0) delete data.start;
        if (data.q === "") delete data.q;
        if (is.isEqual(data.ft, {})) delete data.ft;
        return data;
    }

    toGetParams() {
        return 'state=' + encodeURIComponent(JSON.stringify(this._axdata()));
    }
}
