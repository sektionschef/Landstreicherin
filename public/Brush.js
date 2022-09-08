class Brush {
    constructor(orientation, start, end, otherOne) {
        this.boost = 0.06;  // speed increment increase if eiert
        this.radius = 2;
        this.distanceBoost = 4; // 4 faster, 8 slower, but thicker
        this.noiseYzoom = 0.05;  // zoom on noise
        this.amplitudeNoiseY = 2.5;  // up and down on Y axis

        this.orientation = orientation;
        this.start = start;  // start of line
        this.end = end;  // end of line
        this.otherOne = otherOne;  // y axis

        this.killMe = false;
        if (this.orientation == "x") {
            this.pos = createVector(this.start, 0, 0);
        } else if (this.orientation == "y") {
            this.pos = createVector(0, this.start, 0);
        }
        this.vel = createVector(0, 0, 0);
        this.acc = createVector(0, 0, 0);
        this.Distance = this.end - this.start;
        this.accDist = this.Distance / this.distanceBoost;  // distance for acceleration and slow down
        this.acc1 = this.start + this.accDist;  // distance for full speed
        this.acc2 = this.end - this.accDist;  // distance for slowing down speed


        if (this.orientation == "x") {
            this.accBoost = createVector(this.boost, 0, 0)  // increment for acc and change z axis
            this.sloBoost = createVector(this.boost * -1, 0, 0)   // increment for slowing down and change z axis
        } else if (this.orientation == "y") {
            this.accBoost = createVector(0, this.boost, 0)  // increment for acc and change z axis
            this.sloBoost = createVector(0, this.boost * -1, 0)   // increment for slowing down and change z axis
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

    update() {

        let mover = 0;
        if (this.orientation == "x") {
            mover = this.pos.x;
        } else if (this.orientation == "y") {
            mover = this.pos.y;
        }

        // start - boost
        if (mover < this.acc1) {
            this.acc = this.accBoost;

            // full speed
        } else if (mover >= this.acc1 && mover < this.acc2) {
            this.acc = createVector(0, 0, 0);

            // slow down
        } else if (mover >= this.acc2 && mover < this.end) {

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
            this.pos.y = this.otherOne + this.noisesY[Math.round(mover)];
        } else if (this.orientation == "y") {
            this.pos.x = this.otherOne + this.noisesY[Math.round(mover)];
        }
        this.radius = map(this.vel.x, 0, 3, 3.75, 1.75)
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