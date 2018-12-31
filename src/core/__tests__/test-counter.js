
import counter from "../counter";


test("counter", () => {
    expect(counter('hello-')).toEqual('hello-1');
    expect(counter()).toEqual(1);
    expect(counter('foo-', 5)).toEqual('foo-5');
    expect(counter('foo-')).toEqual('foo-6');
});
