class Brush {
    constructor(startFrame) {
        this.startFrame = startFrame;

        this.accBoost = createVector(0, 0.01, 0);
        this.topspeed = 5;
        this.totalDuration = 500;

        this.pos = createVector(0, 0, 0);
        this.vel = createVector(0, 0, 0);
        this.acc = createVector(0, 0, 0);
        this.endFrame = this.startFrame + this.totalDuration;
    }

    update() {

        if (frameCount >= this.startFrame && frameCount <= this.endFrame) {
            // this.acc = p5.Vector.random3D();

            this.acc.add(this.accBoost);
            this.vel.add(this.acc);
            this.velLimit = this.vel.limit(this.topspeed);
            this.pos.add(this.vel);
        }
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