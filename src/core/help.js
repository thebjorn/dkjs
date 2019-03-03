
import dk from "../dk-obj";


/**
 * Create help nodes for all nodes with class="help" under ``item``.
 * 
 * This is automatically called for body on load, but might need to be called explicitly
 * on any dom that is loaded later.
 * 
 * @param item
 */
export function help(item) {
    dk.$(item).find('.help > .help-text').each(function () {
        let $help = dk.$(this).parent();
        let helptext = dk.$(this);
        // $help.css('position', 'relative');
        let trigger = dk.$('<div class="help-trigger"><a><dk-icon value="question-circle"/></a></div>');
        $help.prepend(trigger);
        
        // .popover comes from bootstrap and is thus difficult to unit test...
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
}
