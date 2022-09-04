class Brush {
    constructor(startX, endX) {
        this.startX = startX;
        this.endX = endX;

        // this.accBoost = createVector(0.1, 0, 0);
        this.boost = 0.06;  // increase if eiert
        this.startZ = 0;

        this.pos = createVector(this.startX, 0, this.startZ);
        this.vel = createVector(0, 0, 0);
        this.acc = createVector(0, 0, 0);
        this.Distance = this.endX - this.startX;

        this.accDist = this.Distance / 4;  // distance for acceleration
        this.acc1 = this.startX + this.accDist;  // distance for full speed
        this.acc2 = this.endX - this.accDist;  // distance for slowing down speed

        this.accBoost = createVector(
            this.boost,
            0,
            0
        )  // increment for acc and change z axis
        this.sloBoost = createVector(
            this.boost * -1,
            0,
            0
        )   // increment for slowing down and change z axis
    }

    update() {

        if (this.pos.x < this.acc1) {
            this.acc = this.accBoost;

        } else if (this.pos.x >= this.acc1 && this.pos.x < this.acc2) {
            this.acc = createVector(0, 0, 0);

        } else if (this.pos.x >= this.acc2 && this.pos.x < this.endX) {

            this.acc = this.sloBoost;

        } else if (this.pos.x > this.endX) {
            // console.log("pos x: " + this.pos.x + " endX: " + this.endX);
            this.acc = createVector(0, 0, 0);
            this.vel = createVector(0, 0, 0);
        }
        this.vel.add(this.acc);

        // console.log(this.vel.x);
        this.pos.add(this.vel);

        this.pos.z = map(this.vel.x, 0, 3, 0, -500);  // map the distance to velocity
        // console.log("pos z: " + this.pos.z);
    }

    display() {
        push();
        translate(this.pos);
        noStroke();
        fill("black");
        sphere(3);
        pop();

        if (MODE == 5) {
            // startX
            push();
            translate(this.startX, this.pos.y, 0);
            noStroke();
            fill("purple");
            sphere(2);
            pop();

            // acc1
            push();
            translate(this.acc1, this.pos.y, 0);
            noStroke();
            fill("red");
            sphere(2);
            pop();

            // acc2
            push();
            translate(this.acc2, this.pos.y, 0);
            noStroke();
            fill("red");
            sphere(2);
            pop();

            // line
            push();
            strokeWeight(1);
            stroke("green");
            line(this.startX, 0, 0, this.endX, 0, 0);
            pop();

            // endX
            push();
            translate(this.endX, this.pos.y, 0);
            noStroke();
            fill("purple");
            sphere(2);
            pop();
        }

    }


}