
import {dk} from "../create-dk-package";


test("test-dk-package", () => {
    expect(1).toBe(1);
    // expect(dk.version).toBe('0.99.1');
    expect(dk.version).toBeDefined();
});
