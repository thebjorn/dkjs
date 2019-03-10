
import {throttle} from "../throttle";

jest.useFakeTimers();

test("throttle before", () => {
    const callback = jest.fn();
    const debounce_fn = throttle(250, callback);
    expect(callback).not.toBeCalled();

    let i = 0;
    jest.advanceTimersByTime(500);
    for (i=0;i<100;i++) debounce_fn();
    expect(callback).toHaveBeenCalledTimes(1);

    for (i=0;i<100;i++) debounce_fn();
    expect(callback).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(250);
    for (i=0;i<100;i++) debounce_fn();
    expect(callback).toHaveBeenCalledTimes(2);
});


test("throttle-debounce-false", () => {
    // false = only call callback once, at end.
    const callback = jest.fn();
    const debounce_fn = throttle(250, callback, false);
    expect(callback).not.toBeCalled();

    let i = 0;
    jest.advanceTimersByTime(500);
    for (i=0;i<100;i++) debounce_fn();
    expect(callback).toHaveBeenCalledTimes(0);

    for (i=0;i<100;i++) debounce_fn();
    expect(callback).toHaveBeenCalledTimes(0);
    jest.advanceTimersByTime(250);
    for (i=0;i<100;i++) debounce_fn();
    expect(callback).toHaveBeenCalledTimes(1);
});



test("throttle-debounce-true", () => {
    // false = only call callback once, at beginning.
    const callback = jest.fn();
    const debounce_fn = throttle(250, callback, true);
    expect(callback).not.toBeCalled();

    let i = 0;
    jest.advanceTimersByTime(500);
    for (i=0;i<100;i++) debounce_fn();
    expect(callback).toHaveBeenCalledTimes(1);

    for (i=0;i<100;i++) debounce_fn();
    expect(callback).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(250);
    for (i=0;i<100;i++) debounce_fn();
    expect(callback).toHaveBeenCalledTimes(2);
    jest.advanceTimersByTime(250);
    for (i=0;i<100;i++) debounce_fn();
    expect(callback).toHaveBeenCalledTimes(3);
});
