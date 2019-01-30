

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
