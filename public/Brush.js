class Brush {
    constructor(startX, endX) {
        this.startX = startX;
        this.endX = endX;

        // this.accBoost = createVector(0.1, 0, 0);
        this.topspeed = 5;

        this.pos = createVector(this.startX, 0, 0);
        this.vel = createVector(0, 0, 0);
        this.acc = createVector(0, 0, 0);
        this.Distance = this.endX - this.startX;

        this.accDist = this.Distance / 4;  // distance for acceleration
        this.acc1 = Math.abs(this.startX + this.accDist);  // distance for full speed
        this.acc2 = Math.abs(this.endX - this.accDist);  // distance for slowing down speed

        this.accBoost = this.topspeed / this.acc1  // increment for acc
        this.sloBoost = this.topspeed / this.acc2 * -1  // increment for slowing down
    }

    update() {

        if (this.pos.x < this.acc1) {
            this.acc = this.accBoost;

        } else if (this.pos.x >= this.acc1 && this.pos.x < this.acc2) {
            this.acc = 0;

        } else if (this.pos.x >= this.acc2 && this.pos.x < this.endX) {
            this.acc = this.sloBoost;

        } else if (this.pos.x >= this.endX) {
            this.acc = createVector(0, 0, 0);
            this.vel = createVector(0, 0, 0);
            // console.log("asfaf");
        }
        this.vel.add(this.acc);
        this.vel = this.vel.limit(this.topspeed);
        this.pos.add(this.vel);
        // console.log("pos: " + this.pos.x);

    }

    display() {
        push();
        translate(this.pos);
        noStroke();
        fill("black");
        sphere(5);
        pop();
    }


}