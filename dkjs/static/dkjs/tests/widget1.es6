// compile with: npx babel widget1.es6 --out-file widget1.js
    
class HelloFoo extends dk.Widget {
    // name = 'nobody';
    constructor(...props) {
        super({
            name: 'nobody'
        }, ...props);
    }
    draw() {
        this.widget().text(`Hello ${this.name}!`);
        dk.dir(this);
    }
}

HelloFoo.create_inside("#work > .foo", {
    name: 'Bjørn'
});
