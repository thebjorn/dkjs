/**
 *
 * let widgets = {a: <...>, b: <...>, ...};
 * dk.mcall(widgets, 'redraw', self);
 *
 * => widgets.a.redraw(self); widgets.b.redraw(self); ...;
 *
 * @param obj
 * @param method
 * @param args
 */
export function mcall(obj, method, ...args) {
    let result = {};
    
    for (const field in obj) {
        let item = obj[field];
        if (item[method]) {
            result[field] = item[method].apply(item, args);
        }
    }
    return result;
}
