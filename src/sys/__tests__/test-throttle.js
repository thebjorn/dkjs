
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
