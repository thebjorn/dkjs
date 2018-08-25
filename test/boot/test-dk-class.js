

const Class = require('../../src/lifecycle/boot/dk-class');
// import { Class } from '../../src/boot/dk-class';

QUnit.test('Class.create ctor', (assert) => {
    class Person extends Class {
        constructor(props) {
            super(props);
        }
    }

    let p = Person.create({name: 'roger'});
    assert.equal(p.name, 'roger');
    assert.equal(p instanceof Person, true);
});
