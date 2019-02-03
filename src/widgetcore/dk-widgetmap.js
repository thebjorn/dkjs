
/*
 *  Map all widget type names to their classes.
 */

const _widget_map = {};

const _add_widget_to_map = function (w) {
    const name = w.type ? w.type : w.name;
    if (_widget_map[name]) {
        alert('There is allready a widget with id: ' + name);
    }
    _widget_map[name] = w;
};

const _get_widget_from_map = function (wtype) {
    return _widget_map[wtype];
};


export default {
    wmap: _widget_map,
    add: _add_widget_to_map,
    get: _get_widget_from_map
};
