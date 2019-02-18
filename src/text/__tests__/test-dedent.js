import {dedent} from "../template-functions";


test("equalith", () => {
    const a = [1, 2];
    const s1 = dedent`
        hello
        ${JSON.stringify(a)}
        world
    `;
    const s2 = `
hello
[1,2]
world
`;
    expect(s1).toBe(s2);
});
