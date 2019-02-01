
import $ from 'jquery';
import css from "../dk-css";


test("web.css.maxheight", () => {
    const adiv = $('<div/>').addClass('a').css('height', 200);
    const a = css.maxheight(adiv, {height: 20, duration: 0.01});
    expect(a === "none" || a === "").toBeTruthy();
});


test("web.css.rotate", () => {
    const adiv = $('<div/>').addClass('a');
    const a = css.rotate(adiv, {degrees: 90, duration: 0.01});
    expect(a.degrees).toEqual(90);
});

test("web.css.tilt", () => {
    const adiv = $('<div/>').addClass('a');
    const a = css.tilt(adiv, {direction: 'bottom left', duration: 0.01});
    expect(a.degrees).toEqual(90);
});
