// import Class from "../lifecycle/coldboot/dk-class";
// import dk from "../dk-obj";
// import widgetmap from "./dk-widgetmap";
// import counter from "../core/counter";
// import page from "./dk-page";
// import {Layout} from "../layout/dk-layout";
// import template from "lodash.template";
// import jason from "../data/datacore/dk-json";
// import {cls2id} from "../text/text-utils";
// import {dkconsole} from "../lifecycle/dkboot/dk-console";
// import {dkwarning} from "../lifecycle/coldboot/dkwarning";
// import is from "../is";
// import {deep_observer} from "../data/observable";
import {ServerWidget} from "./server-widget";


export class Widget extends ServerWidget {
    constructor(...attrs) {
        super(...attrs);
    }

    // init() {}

    // // XXX: can this be removed? ==> no, used in dk.tree.Generation (nodelist)
    // // QQQ: is it the same as create_inside(..., append=true) ??
    // /*
    //  *  Append a place holder to this widget, then create_on this placeholder.
    //  */
    // create_subwidget(WidgetType, props, placeholder) {
    //     dkwarning("create_subwidget callled..");
    //     if (typeof WidgetType === 'string') {
    //         WidgetType = widgetmap.get(WidgetType);
    //     }
    //     if (!WidgetType) dk.error("There is no known class named: ", WidgetType, widgetmap.wmap);
    //     props = props || {};
    //     const sub_id = props.id || WidgetType.next_widget_id() || counter(this.id + '-subwidget-');
    //     placeholder = placeholder || dk.$('<div/>');
    //     placeholder.prop('id', props.id || sub_id);
    //     this.widget().append(placeholder);
    //     return WidgetType.create_on(placeholder, props);
    // }

}


//
// /*
//  *  jQuery plugin to create widgets onto selectors.
//  */
// $.fn.dkWidget = function (WidgetType) {
//     //dk.debug('WidgetType: ', WidgetType, ' typeof: ', typeof WidgetType);
//     if (typeof WidgetType === 'string') {
//         // Look up the widget type if passed in as a string.
//         WidgetType = widgetmap.get(WidgetType);
//     }
//
//     if (!WidgetType) dk.log("There is no known class named: ", WidgetType, widgetmap.wmap);
//
//     return this.each(function () {
//         const widget_id = $(this).prop('id');
//         if (!widget_id) {
//             if (!WidgetType.type) dk.debug("Widget with no ``type`` attribute", WidgetType);
//             widget_id = WidgetType.next_widget_id();
//             $(this).prop('id', widget_id);
//         }
//         WidgetType.create_on($(this), $(this).getAttributes());
//         return widget_id;
//     });
// };
//
// //        return Widget;
//
// $(document).ready(function () {
//     // convert layout boxes to widgets
//     $('[dkwidget]').each(function () {
//         const $this = $(this);
//         const wtype = $this.attr('dkwidget');
//         const width = $this.attr('width');
//         if (width) $this.width(width);
//         const height = $this.attr('height');
//         if (height) $this.height(height);
//         $this.dkWidget(wtype);
//     });
// });
//
//
// module.exports = Widget;
