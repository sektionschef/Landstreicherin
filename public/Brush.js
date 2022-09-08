class Brush {
    constructor(startX, endX, y) {
        this.boost = 0.06;  // speed increment increase if eiert
        this.radius = 3;
        this.distanceBoost = 4; // 4 faster, 8 slower, but thicker
        this.noiseYzoom = 0.05;  // zoom on noise
        this.amplitudeNoiseY = 2.5;  // up and down on Y axis

        this.startX = startX;  // start of line
        this.endX = endX;  // end of line
        this.y = y;

        this.killMe = false;
        this.pos = createVector(this.startX, 0, 0);
        this.vel = createVector(0, 0, 0);
        this.acc = createVector(0, 0, 0);
        this.Distance = this.endX - this.startX;
        this.accDist = this.Distance / this.distanceBoost;  // distance for acceleration and slow down
        this.acc1 = this.startX + this.accDist;  // distance for full speed
        this.acc2 = this.endX - this.accDist;  // distance for slowing down speed


        this.accBoost = createVector(this.boost, 0, 0)  // increment for acc and change z axis
        this.sloBoost = createVector(this.boost * -1, 0, 0)   // increment for slowing down and change z axis

        this.makeSomeNoise();
    }

    makeSomeNoise() {
        this.noisesY = {};

        let ioff = getRandomFromInterval(0, 200);  // start at different location for each line

        // Iterate over horizontal pixels
        for (let i = this.startX; i <= this.endX; i++) {
            // Calculate a y value according to noise, map to

            // console.log(i);
            this.noisesY[i] = map(noise(ioff), 0, 1, -this.amplitudeNoiseY, this.amplitudeNoiseY);

            // Increment x dimension for noise
            ioff += this.noiseYzoom;
        }
    }

    update() {

        // start - boost
        if (this.pos.x < this.acc1) {
            this.acc = this.accBoost;

            // full speed
        } else if (this.pos.x >= this.acc1 && this.pos.x < this.acc2) {
            this.acc = createVector(0, 0, 0);

            // slow down
        } else if (this.pos.x >= this.acc2 && this.pos.x < this.endX) {

            this.acc = this.sloBoost;

            // stop
        } else if (this.pos.x > this.endX) {
            // console.log("pos x: " + this.pos.x + " endX: " + this.endX);
            this.acc = createVector(0, 0, 0);
            this.vel = createVector(0, 0, 0);
        }
        this.vel.add(this.acc);
        this.pos.add(this.vel);

        this.pos.y = this.y + this.noisesY[Math.round(this.pos.x)];
        this.radius = map(this.vel.x, 0, 3, 3.75, 1.75)
    }

    display() {
        push();
        translate(-width / 2, -height / 2);
        translate(this.pos);
        noStroke();
        fill("black");
        // sphere(this.radius);
        ellipse(0, 0, this.radius * 2, this.radius);
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