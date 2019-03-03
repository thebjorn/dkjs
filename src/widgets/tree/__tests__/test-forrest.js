
import dk from "../../../dk-obj";
import {Forrest} from "../tree-data";
import is from "../../../is";


test("test-basic-forrest-to-tree-datasource-conversion", () => {

    const n = function (n, c) {
        const res = {name: n};
        if (c) res._children = c;
        return res;
    };
    const f = new Forrest([
        n('a', [
            n('aa'),
            n('ab', [
                n('aba')
            ]),
            n('ac')
        ]),
        n('b', [
            n('ba'),
            n('bb'),
            n('bc')
        ])
    ]);
    dk.dir('f', f);
    expect(f.cachekeys()).toHaveLength(9);  // "Total number of nodes are 9"
    expect(f.roots).toHaveLength(2);  // "Total number of roots are 2"
    expect(f.roots[0].kind).toBe('tree');  // "The root nodes should be 'trees'"

    expect(is.isEqual(f.cache[f.roots[0].children[0]], f.roots[0]._children[0])).toBeTruthy();  // "cache[obj._children[0]] === obj.children[0]");

    expect(f.roots[0]._children[0].root).toEqual(f.roots[0].id);

    expect(f.depth).toBe(3);  // 'depth should be 3 (generations)');
    expect(f.height).toBe(3);  // 'max height at any level should be 3');

});
