

import {validate} from "../validators";

test("validate-email", () => {
    expect(validate.email('bp@example.com')).toBeTruthy();
});

test("validate-phone", () => {
    expect(validate.phone('12345678')).toBeTruthy();
});


test("validate-persnr-true", () => {
    expect(validate.persnr('24067590852')).toBeTruthy();
});

test("validate-persnr-false", () => {
    expect(validate.persnr('12345678901')).toBeFalsy();
});
