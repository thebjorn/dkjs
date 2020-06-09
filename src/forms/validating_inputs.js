import $ from 'jquery';
import dk from "../dk-obj";

const debug=true;

export function validated_input() {
    dk.$.fn.validated_input = function (settings) {
        settings = $.extend({
            validate: function () {
                return true;
            },
            missing_message: 'Påkrevd felt!',
            empty_message: '',
            invalid_message: 'Ugyldig!',
            valid_message: ""
        }, settings);

        return this.each(function () {
            const $this = $(this);

            function _trigger() {
                if (debug) dk.debug('triggering:', arguments, $this.prop('id'));
                $this.trigger.apply($this, arguments);
                return $this;
            }

            $this.on('prevalid empty invalid missing checked valid', function (e) {
                $this.data('currentval', $this.val());
                $this.data('state', e.type);
                $this.removeClass('prevalid empty invalid missing checked valid').addClass(e.type);
                if (debug) dk.debug(e.type, ' ==>> state', $this.data());
            });

            $this.on('missing empty invalid valid', function (e) {
                _trigger('errormessage', settings[e.type + '_message']);
            });

            $this.on('checked', function () {
                if (settings.verify) {
                    _trigger('verify-begin').addClass('verifying');

                    settings.verify.call($this, $this.val(), function (data) {
                        _trigger('verify-end').removeClass('verifying');
                        _trigger(data.verified ? 'valid' : 'invalid');
                        if (!data.verified && data.errormessage) _trigger("errormessage", data.errormessage);
                    });

                } else {
                    _trigger('valid');
                }
            });

            $this.on('validate', function () {
                const curval = $this.val();
                if (curval === $this.data('currentval')) {
                    if (debug) dk.debug("NO-CHANGE, skipping validation!");
                    return;
                }
                const valid = settings.validate.call($this, curval);
                _trigger(valid ? 'checked' : 'invalid');
            });

            function _attach_change_handlers() {
                function _change_handler(event) {
                    if (debug) dk.info('handling:', event);
                    if ($this.val()) {
                        _trigger('validate');
                    } else {
                        _trigger($this.prop('required') ? 'invalid' : 'empty');
                    }
                }

                // older browsers
                $this.on('keydown.validated_input keyup.validated_input keypress.validated_input', _change_handler);

                $this.on('input.validated_input', function (event) {
                    // modern browsers have oninput..
                    $this.off('keydown.validated_input');
                    $this.off('keypress.validated_input');
                    $this.off('keyup.validated_input');
                    $this.off('input.validated_input');
                    $this.on('input.validated_input', _change_handler);
                    _change_handler(event);
                });
            }

            // from initial states..
            if ($this.val()) {
                _attach_change_handlers();
                _trigger('validate');   // Entry to stage 2
            } else {
                _trigger('prevalid');

                $this.on('blur.validated_input', function () {
                    if ($this.val()) {
                        $this.off('blur.validated_input');
                        _attach_change_handlers();
                        _trigger('validate');   // Entry to stage 2
                    } else {
                        _trigger($this.prop('required') ? 'missing' : 'prevalid');
                    }
                });
            }
        });
    };
}
