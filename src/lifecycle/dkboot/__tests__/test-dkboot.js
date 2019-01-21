
import setup_console from "../dk-console";
import setup_signals from "../dk-signals";
import create_debug_environment from "../lifecycle-create-debug-environment";
import parse_script_tag from "../lifecycle-parse-script-tag";

test("create_debug_environment", () => {
    const dk = {};
    create_debug_environment(dk);
    dk.add({
        foo() { return 42; }
    });
    expect(dk.foo()).toBe(42);
});
