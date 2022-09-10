class Brush {
    constructor(orientation, start, end, start2, end2) {
        this.boost = 0.06;  // speed increment increase if eiert
        this.radius = 2;
        this.distanceBoost = 4; // 4 faster, 8 slower, but thicker - where the points are
        this.noiseYzoom = 0.005;  // zoom on noise
        this.amplitudeNoiseY = 2.5;  // up and down on Y axis

        this.orientation = orientation;
        this.start = start;  // start of line
        this.end = end;  // end of line
        this.start2 = start2;  // y axis
        this.end2 = end2;  // y axis

        this.killMe = false;
        if (this.orientation == "x") {
            this.pos = createVector(this.start, 0, 0);
        } else if (this.orientation == "y") {
            this.pos = createVector(0, this.start, 0);
        } else if (this.orientation == "xy") {
            this.pos = createVector(this.start, this.start2, 0);
        } else if (this.orientation == "yx") {
            this.pos = createVector(this.start2, this.start, 0);
        }

        this.vel = createVector(0, 0, 0);
        this.acc = createVector(0, 0, 0);
        this.Distance = this.end - this.start;
        this.Distance2 = this.end2 - this.start2;
        this.accDist = this.Distance / this.distanceBoost;  // distance for acceleration and slow down
        this.accDist2 = this.Distance2 / this.distanceBoost;  // distance for acceleration and slow down
        this.accA = this.start + this.accDist;  // distance for full speed
        this.accA2 = this.start2 + this.accDist2;  // distance for full speed
        this.accB = this.end - this.accDist;  // distance for slowing down speed
        this.accB2 = this.end2 - this.accDist2;  // distance for slowing down speed


        if (this.orientation == "x") {
            this.accBoost = createVector(this.boost, 0, 0)  // increment for acc and change z axis
            this.sloBoost = createVector(this.boost * -1, 0, 0)   // increment for slowing down and change z axis
        } else if (this.orientation == "y") {
            this.accBoost = createVector(0, this.boost, 0)  // increment for acc and change z axis
            this.sloBoost = createVector(0, this.boost * -1, 0)   // increment for slowing down and change z axis
        } else if (this.orientation == "xy" || this.orientation == "yx") {
            this.accBoost = createVector(this.boost, this.boost, 0)  // increment for acc and change z axis
            this.sloBoost = createVector(this.boost * -1, this.boost * -1, 0)   // increment for slowing down and change z axis
        }

        this.makeSomeNoise();
    }

    makeSomeNoise() {
        this.noisesY = {};

        let ioff = getRandomFromInterval(0, 200);  // start at different location for each line

        // Iterate over horizontal pixels
        for (let i = this.start; i <= this.end; i++) {
            // Calculate a y value according to noise, map to

            // console.log(i);
            this.noisesY[i] = map(noise(ioff), 0, 1, -this.amplitudeNoiseY, this.amplitudeNoiseY);

            // Increment x dimension for noise
            ioff += this.noiseYzoom;
        }
    }

    move(mover, primaryAcc, secondaryAcc) {
        // start - boost
        if (mover < primaryAcc) {
            this.acc = this.accBoost;

            // full speed
        } else if (mover >= primaryAcc && mover < secondaryAcc) {
            this.acc = createVector(0, 0, 0);

            // slow down
        } else if (mover >= secondaryAcc && mover < this.end) {

            this.acc = this.sloBoost;

            // stop
        } else if (mover > this.end) {
            // console.log("pos x: " + mover + " end: " + this.end);
            this.acc = createVector(0, 0, 0);
            this.vel = createVector(0, 0, 0);
        }
        this.vel.add(this.acc);
        this.pos.add(this.vel);

        if (this.orientation == "x") {
            this.pos.y = this.start2 + this.noisesY[Math.round(mover)];
        } else if (this.orientation == "y") {
            this.pos.x = this.start2 + this.noisesY[Math.round(mover)];
        } else if (this.orientation == "xy") {
        }
        // MISSING THE NOISE
    }

    update() {

        if (this.orientation == "x") {
            this.move(this.pos.x, this.accA, this.accB);
        } else if (this.orientation == "y") {
            this.move(this.pos.y, this.accA, this.accB);
        } else if (this.orientation == "xy" || this.orientation == "yx") {
            this.move(this.pos.x, this.accA, this.accB);
            this.move(this.pos.y, this.accA2, this.accB2);
        }


        this.radius = map(this.vel.x, 0, 3, 2.75, 1.75)
    }

    display() {
        push();
        translate(-width / 2, -height / 2);
        translate(this.pos);
        noStroke();
        fill("black");
        // sphere(this.radius);
        ellipse(0, 0, this.radius, this.radius);
        pop();

        if (MODE == 5) {
            // start
            push();
            translate(this.start, this.pos.y, 0);
            noStroke();
            fill("purple");
            sphere(2);
            pop();

            // accA
            push();
            translate(this.accA, this.pos.y, 0);
            noStroke();
            fill("red");
            sphere(2);
            pop();

            // accB
            push();
            translate(this.accB, this.pos.y, 0);
            noStroke();
            fill("red");
            sphere(2);
            pop();

            // line
            push();
            strokeWeight(1);
            stroke("green");
            line(this.start, 0, 0, this.end, 0, 0);
            pop();

            // end
            push();
            translate(this.end, this.pos.y, 0);
            noStroke();
            fill("purple");
            sphere(2);
            pop();
        }

    }


}