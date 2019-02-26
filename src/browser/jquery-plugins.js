

export function jq_links2popup(dk) {

    // create popup windows from links with class=popup
    dk.$('a.popup').click(function () {
        const w = window.open(
            dk.$(this).prop('href'),
            dk.$(this).prop('id') || "WindowName",
            ('width=' + dk.$(this).attr('width') +
            ',height=' + dk.$(this).attr('height') +
            ',resizeable=yes,' +
            'scrollbars=yes,' +
            'toolbar=no,' +
            'location=no,' +
            'directories=no,' +
            'status=no,' +
            'menubar=no,' +
            'copyhistory=no')
        );
        if (w) w.focus();
        return false;
    });

}



export function jq_help_button(dk) {
    const _helpfn = function (item) {
        dk.$(item).find('.help > .help-text').each(function () {
            let $help = dk.$(this).parent();
            let helptext = dk.$(this);
            // $help.css('position', 'relative');
            let trigger = dk.$('<div class="help-trigger"><a><dk-icon value="question-circle"/></a></div>');
            $help.prepend(trigger);
            $help.find('.help-trigger > a').addClass('xbtn').attr('tabindex', 10).popover({
                html: true,
                title: helptext.attr('title') || 'Hjelp..',
                container: 'body',
                trigger: 'focus',
                toggle: 'popover',
                placement: helptext.attr('placement') || 'auto left',
                content: helptext.html()
            });
        });
    };


    /*
        To get a little blue questionmark that displays help text when hoverered over,
        use the following markup:

            <div class="help">

                <div class="help-text" title="my title" hidden>
                    Help text goes here..
                </div>

                content that should get the blue questionmark goes here..

            </div>

        override .help>.help-trigger to change the palcement of the ?-mark.
        The defaults are in dkjs/css/dk-help.less
    */
    dk.$(document).ready(function () {
        _helpfn('body');
    });
}


export function jq_get_attributes(dk) {
    /*
     *  Return all attributes of a html object.
     *
     *  Usage::
     *
     *     $("<input type='text' value='5'>").getAttributes()
     *
     *          => {type: 'text', value: '5'}
     *
     *     $("<div data-foo="FOO" data-bar="BAR" pos=0).getAttributes()
     *
     *          => {
     *              data: {
     *                  foo: 'FOO',
     *                  bar: 'BAR'
     *              },
     *              pos: 0
     *          }
     *
     *  It is recommended that you use the html5 standard "data-"
     *  prefix for data attributes, although this is not required.
     *
     */
    dk.$.fn.getAttributes = function () {   // TODO: add prefix selector (e.g. all data- attributes).
        const elem = this,
            attr = {};

        const set_attr = function (res, name_parts, val) {
            //dk.debug('set_attr', res, name_parts, val);
            if (name_parts.length === 1) {
                res[name_parts[0]] = val;
                return;
            } else {
                const first = name_parts.shift();
                if (!res[first]) {
                    res[first] = {};
                }
                set_attr(res[first], name_parts, val);
            }
        };

        if (elem.length) dk.$.each(elem.get(0).attributes, function (v, n) {
            n = n.nodeName || n.name;
            v = elem.attr(n); // rely on $.fn.attr, it makes some filtering and checks
            if (v !== undefined && v !== false) set_attr(attr, n.split('-'), v);
        });

        return attr;
    };
}


export function jq_toggle_busy(dk) {
    /*
     *  Add, or remove, a semi-transparent shim above the selected item(s).
     *
     *  Usage::
     *
     *     this.widget().toggle_busy(true);
     *     this.widget().toggle_busy(false);
     */
    dk.$.fn.toggle_busy = function (state) {
        state = !!state;

        return this.each(function () {
            const $this = dk.$(this);
            const shimdata = $this.data('busy-shim');
            if (!state || shimdata) {
                dk.$('#' + shimdata).remove();
            } else if (state || !shimdata) {
                const height = $this.outerHeight();
                const width = $this.outerWidth();
                const offset = $this.offset();

                const shim = dk.$('<div/>').prop('id', 'busy-shim-' + dk.counter()).css({
                    position: 'absolute',
                    width: width,
                    height: height,
                    left: offset.left,
                    top: offset.top,
                    zIndex: 999,
                    backgroundColor: 'rgba(222,222,222,.5)'
                });
                dk.$('body').append(shim);
                $this.data('busy-shim', shim.prop('id'));
            }
        });
    };
}


export function jq_access_keys(dk) {
    /*
     *   $().accesskeys();
     */
    function possibilities(label, used) {
        const res = [];
        for (let i = 0; i < label.length; i++) {
            const ch = label[i];
            if (!used[ch]) {
                const t = {};
                t[ch] = label;
                res.push(Object.assign(t, used));
            }
        }
        return res;
    }

    function find_keys(labels, used) {
        if (labels.length === 1) {
            return possibilities(labels[0], used);
        } else {
            const _used_list = find_keys(labels.slice(-1), used);
            for (let i = 0; i < _used_list.length; i++) {
                const _used = _used_list[i];
                const _found_list = find_keys(labels.slice(0, -1), _used);
                if (_found_list.length > 0) return [_found_list[0]];
            }
            return [];
        }
    }

    function findKeys(labels, used) {
        const r = find_keys(labels, used || {});
        return r.length > 0 ? r[0] : null;
    }

    function wrap_access_key($item, key, settings) {
        const text = $item.text();
        if (text === "") return;
        const txt = text.toLowerCase();
        const pos = txt.indexOf(key);
        const isupper = text[pos] === text[pos].toUpperCase();
        if (isupper) key = key.toUpperCase();
        $item.html(text.slice(0, pos) + settings.wrap[0] + key + settings.wrap[1] + text.slice(pos + 1));
    }

    dk.$.fn.accesskeys = function (settings) {
        settings = dk.$.extend({
            skip: /[^\wæøå]/gi,                             // charachters to skip (invalid as access keys)
            keep: '[accesskey][accesskey!="-"]',            // selector of items to NOT modify
            modify: '[accesskey="-"]',                      // selector of items to modify
            wrap: ['<span class="accesskey">', '</span>']   // tag to wrap the access key with (null => don't wrap).
        }, settings);

        const used_chars = Array.from(dk.$(settings.keep).map(function (v, i) {
            return dk.$(v).attr('accesskey');
        }));
        const used = dk.zip_object(used_chars, dk.times(used_chars.length, () => '-'));

        const items = dk.$(settings.modify);
        const labels = Array.from(items.map(function (val, i) {
            return dk.$(val).text().trim().toLowerCase().replace(settings.skip, '');
        }));
        const item_map = dk.zip_object(labels, items);
        const akeys = findKeys(labels, used);
        if (akeys === null) {
            dk.error("Could not find valid combination of access keys.");
            return;
        }

        Object.keys(akeys).forEach(function (key) {
            const label = akeys[key];
            const $item = dk.$(item_map[label]);
            $item.attr('accesskey', key);
            if (settings.wrap !== null) wrap_access_key($item, key, settings);
        });

        return this;
    };
}
