class Brush {
    constructor() {
        this.pos = createVector(0, 0, 0);
        this.vel = createVector(0, 0, 0);
        this.acc = createVector(0, 0, 0);
    }

    update() {

        // this.acc = p5.Vector.random3D();
        this.acc.add(0);
        this.vel.add(this.acceleration);
        this.pos.add(this.velocity);
    }

    display() {
        push();
        translate(this.pos);
        noStroke();
        fill("red");
        sphere(30);
        pop();
    }


}