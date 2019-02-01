
/*
 *  Functionality to make it easier to access complex css from javascript.
 */
import $ from 'jquery';

// ensure jquery
const _$ = item => item.jquery ? item: $(item);

export default {
    getattr(item, attr) {
        return _$(item).css(attr);
    },
    setattr(item, attr, val) {
        item = _$(item);
        const current_value = item.css(attr);
        item.css(attr, val);
        return current_value;
    },
    maxheight(item, props) {
        item = _$(item);
        const height = item.outerHeight();
        const origmh = this.setattr(item, 'max-height', height);
        const duration = props.duration || 0;
        if (duration) {
            this.setattr(item, 'transition-duration', duration + 's');
            this.setattr(item, 'transition-timing-function', 'linear');
            this.setattr(item, 'transition-property', 'max-height');
        }
        item.css('max-height', props.height);

        if (props.done) setTimeout(props.done, (duration * 1000) + 150);

        return origmh;
    },
    rotate(item, props) {
        item = _$(item);
        props = props || {};
        const duration = props.duration || 0;
        const degrees = props.degrees || 0;
        if (duration) {
            this.setattr(item, 'transition-duration', duration + 's');
            this.setattr(item, 'transition-timing-function', 'linear');
            //item.css('transition-timing-function', 'cubic-bezier(0.175, 0.885, 0.32, 1.275)');
            item.css('transition-property', 'transform');
        }
        const xorig = (props.xorig === undefined)? item.outerWidth()/2: props.xorig;
        const yorig = (props.yorig === undefined)? item.outerHeight()/2: props.yorig;

        item.css('transform', 'rotate(' + degrees + 'deg)');
        item.css('transform-origin', `${xorig}px ${yorig}px`);

        if (props.done) setTimeout(props.done, (duration * 1000) + 150);

        const res = Object.assign({}, props);
        delete res.done;
        return Object.assign(res, {
            xorig: xorig,
            yorig: yorig,
            duration: duration,
            degrees: degrees,
            item: item
        });
    },
    /*
     *  Move the (opposite) edge to a corner such that the item tilts over.
     *
     *      dk.css.tilt(item, {direction: 'bottom left', duration: 5});
     */
    tilt(item, properties) {
        const props = Object.assign({}, properties);  // defaults
        item = _$(item);
        const hh = item.outerHeight();
        const hw = item.outerWidth();
        const pitch = props.direction.match(/top|bottom/)[0];
        const yaw = props.direction.match(/left|right/)[0];
        const yorig = hh / 2;
        const xorig = yaw === 'left'? yorig: (hw - yorig);
        let degrees;

        if (pitch === 'top' && yaw === 'right')     degrees = 90;
        if (pitch === 'top' && yaw === 'left')      degrees = -90;
        if (pitch === 'bottom' && yaw === 'right')  degrees = -90;
        if (pitch === 'bottom' && yaw === 'left')   degrees = 90;

        return this.rotate(item, Object.assign(props, {
            degrees: degrees,
            xorig: xorig,
            yorig: yorig
        }));
    },
    /*
     *  Takes props returned from any of the rotation methods and undoes
     *  the rotation.
     */
    unrotate(props) {
        if (!props.item) return;
        this.rotate(props.item, Object.assign(props, {degrees:0}));
    }
};
