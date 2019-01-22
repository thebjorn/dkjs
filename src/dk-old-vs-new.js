

import {set_difference} from "./lifecycle/set-ops";

export default function old_vs_new(dk) {
    const _ = dk._;

    const originaldk = new Set([

        'dk.all', 'dk.$', 'dk._', 'dk.dkjstag', 'dk.version', 'dk.globals', 'dk.debug', 'dk.warn', 'dk.info', 
        'dk.error', 'dk.dir', 'dk.log', 'dk.namespace', 'dk.traverse', 'dk.update', 'dk.merge', 'dk.combine', 
        'dk.subscribe', 'dk.on', 'dk.publish', 'dk.after', 'dk.import', 'dk.Class', 'dk.sys', 'dk.core', 'dk.web',
        'dk.layout', 'dk.widget', 'dk.unsorted', 'dk.panel', 'dk.table', 'dk.filter', 'dk.forms', 'dk.data', 
        'dk.tree', 'dk.ctor_apply', 'dk.icon', 'dk.cursor', 'dk.PostnrLookupWidget', 'dk.require', 'dk.id', 'dk.one',
        'dk.here', 'dk.find', 'dk.dom', 'dk.help', 'dk.id2name', 'dk.cls2id', 'dk.count', 'dk.dedent', 'dk.ready', 
        'dk.initialize', 'dk.bind', 'dk.counter', 'dk.parse_uri', 'dk.ajax', 'dk.json', 'dk.Widget', 'dk.format',
        'dk.jason', 'dk.format_value', 'dk.Date', 'dk.DateTime', 'dk.Duration', 'dk.TableCell', 'dk.TableRow', 
        'dk.DataTableLayout', 'dk.DataTable', 'dk.ColumnDef', 'dk.TableHeader', 'dk.SortDirection', 'dk.VDataTable', 
        'dk.DataGrid', 'dk.ResultSet', 'dk.PagerWidget', 'dk.SearchWidget', 'dk.DataFilter', 'dk.dkjstag.tag', 
        'dk.dkjstag.debug', 'dk.dkjstag.loglevel', 'dk.dkjstag.src', 'dk.dkjstag.main', 
        'dk.import._loadstate', 'dk.import.css', 'dk.import.js', 'dk.sys.ctor_apply', 'dk.sys.cls2pojo', 'dk.sys.mcall',
        'dk.sys.throttle', 'dk.core.help', 'dk.core.text', 'dk.core.lifecycle', 'dk.core.counter', 'dk.web.browser', 
        'dk.web.uri', 'dk.web.html', 'dk.web.dom', 'dk.web.cookie', 'dk.web.state', 'dk.web.css', 'dk.web.client', 
        'dk.layout.Layout', 'dk.layout.TableRowLayout', 'dk.layout.TableLayout', 'dk.layout.ResultsetLayout', 
        'dk.layout.ListLayout', 'dk.widget.page', 'dk.widget.Widget', 'dk.widget.widgetmap', 
        'dk.unsorted.PostnrLookupWidget', 'dk.unsorted.icons', 'dk.unsorted.cursor', 'dk.panel.PanelWidget', 
        'dk.table.TableCell', 'dk.table.TableRow', 'dk.table.DataTableLayout', 'dk.table.DataTable', 
        'dk.table.ColumnDef', 'dk.table.TableHeader', 'dk.table.SortDirection', 'dk.table.VDataTable', 
        'dk.table.DataGrid', 'dk.table.ResultSet', 'dk.table.PagerWidget', 'dk.table.SearchWidget', 
        'dk.filter.DataFilter', 'dk.forms.widgetmap', 'dk.forms.InputWidget', 'dk.forms.TextInputWidget', 
        'dk.forms.TextWidget', 'dk.forms.DurationWidget', 'dk.forms.RadioInputWidget', 'dk.forms.SelectWidget', 
        'dk.forms.RadioSelectWidget', 'dk.forms.CheckboxSelectWidget', 'dk.forms.TriboolWidget', 'dk.forms.validators',
        'dk.data.format', 'dk.data.datatype', 'dk.data.jason', 'dk.data.DataSet', 'dk.data.DataPage', 'dk.data.Source', 
        'dk.data.ArraySource', 'dk.data.JSONDataSource', 'dk.data.AjaxDataSource', 'dk.data.grid2records', 
        'dk.data.Data', 'dk.tree.SelectTable', 'dk.tree.Generation', 'dk.tree.NodeList', 'dk.tree.data', 
        'dk.tree.list', 'dk.dom._inline_elements', 'dk.dom._block_elements', 'dk.dom._self_closing_elements', 
        'dk.dom.is_inline', 'dk.dom.is_block', 'dk.dom.is_tag', 'dk.dom.is_self_closing', 'dk.dom.equal', 
        'dk.dom.dkitem', 'dk.dom.find', 'dk.dom.id', 'dk.dom.one', 'dk.dom.here', 'dk.dom.Template', 'dk.dom.DomItem',
        'dk.format.twodigits', 'dk.format.value', 'dk.format.percent', 'dk.format.bool', 'dk.format.no_date', 
        'dk.format.no_datetime', 'dk.jason.parse', 'dk.jason.stringify', 'dk.jason.postparse'

    ]);

    const res = Object.keys(dk).map(k => `dk.${k}`);
    const roots = Object.keys(dk).filter(k => k !== 'globals' && _.isObject(dk[k]) && dk[k].name !== "SubClass" && !_.isFunction(dk[k]));
    roots.forEach(r => res.push(...Object.keys(dk[r]).map(k => `dk.${r}.${k}`)))
    const dkattrs = new Set(res);
    
    const xoriginaldk = new Set([
        '$', 'Class', 'ColumnDef', 'DataFilter', 'DataGrid', 'DataTable', 'DataTableLayout', 'Date', 'DateTime',
        'Duration', 'PagerWidget', 'PostnrLookupWidget', 'ResultSet', 'SearchWidget', 'SortDirection',
        'TableCell', 'TableHeader', 'TableRow', 'VDataTable', 'Widget', '_', 'after', 'ajax', 'all', 'bind',
        'cls2id', 'combine', 'core', 'count', 'counter', 'ctor_apply', 'cursor', 'data', 'debug', 'dedent',
        'dir', 'dkjstag', 'dom', 'error', 'filter', 'find', 'format', 'format_value', 'forms', 'globals', 'help',
        'here', 'icon', 'id', 'id2name', 'import', 'info', 'initialize', 'jason', 'json', 'layout', 'log', 'merge',
        'namespace', 'on', 'one', 'panel', 'parse_uri', 'publish', 'ready', 'require', 'subscribe', 'sys',
        'table', 'traverse', 'tree', 'unsorted', 'update', 'version', 'warn', 'web', 'widget']);
    console.warn("MISSING:", Array.from(set_difference(originaldk, dkattrs)).sort());
    console.warn("EXTRA:", Array.from(set_difference(dkattrs, originaldk)).sort());
}
