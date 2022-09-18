class Brush {
    constructor(start, end) {
        this.fullspeed = 8;
        this.radius = 0.7;
        this.distanceBoost = 4; // 4 faster, 8 slower, but thicker - where the points are
        this.noiseYzoom = 0.007;  // zoom on noise
        this.amplitudeNoiseY = 3.5;  // up and down on Y axis
        this.OkLevel = 3;  // some offset is ok.
        this.fillColor = color(180);
        // this.strokeColor = color(150);
        this.strokeColor = color("#c79712");
        this.strokeSize = 0.3;

        this.start = start // createVector(start, start2, 0);  // start of line
        this.end = end // createVector(end, end2, 0);

        // this.start2 = start2;  // y axis
        // this.end2 = end2;  // y axis
        // console.log(this.end);

        this.alive = true;
        // if (this.orientation == "x") {
        //     this.pos = createVector(this.start, 0, 0);
        // } else if (this.orientation == "y") {
        //     this.pos = createVector(0, this.start, 0);
        // } else if (this.orientation == "xy") {
        // this.pos = createVector(this.start, this.start2, 0);
        this.pos = this.start.copy();
        // } else if (this.orientation == "yx") {
        //     this.pos = createVector(this.start2, this.start, 0);
        // }

        this.vel = createVector(0, 0, 0);
        this.acc = createVector(0, 0, 0);
        this.Distance = p5.Vector.sub(this.end, this.start);
        this.DistanceLength = this.Distance.mag();
        // this.Distance2 = this.end2 - this.start2;
        this.accDist = this.DistanceLength / this.distanceBoost;  // distance for acceleration and slow down
        // this.accDist2 = this.Distance2 / this.distanceBoost;  // distance for acceleration and slow down
        this.boost = this.fullspeed / this.accDist;
        // this.accA = this.start + this.accDist;  // distance for full speed
        // this.accA2 = this.start2 + this.accDist2;  // distance for full speed
        this.accA = p5.Vector.add(this.start, p5.Vector.div(this.Distance, this.distanceBoost));  // distance for full speed
        // this.accB = this.end - this.accDist;  // distance for slowing down speed
        // this.accB2 = this.end2 - this.accDist2;  // distance for slowing down speed
        this.accB = p5.Vector.sub(this.end, p5.Vector.div(this.Distance, this.distanceBoost));  // distance for full speed

        // console.log("accdist: " + this.accDist);
        // console.log("boost: " + this.boost);
        // console.log("step: " + this.accDist / this.boost);


        // if (this.orientation == "x") {
        //     this.accBoost = createVector(this.boost, 0, 0)  // increment for acc and change z axis
        //     this.sloBoost = createVector(this.boost * -1, 0, 0)   // increment for slowing down and change z axis
        // } else if (this.orientation == "y") {
        //     this.accBoost = createVector(0, this.boost, 0)  // increment for acc and change z axis
        //     this.sloBoost = createVector(0, this.boost * -1, 0)   // increment for slowing down and change z axis
        // } else if (this.orientation == "xy" || this.orientation == "yx") {
        // this.accBoost = createVector(this.boost, this.boost, 0)  // increment for acc and change z axis
        this.accBoost = p5.Vector.mult(p5.Vector.normalize(this.Distance), this.boost);
        // this.sloBoost = createVector(this.boost * -1, this.boost * -1, 0)   // increment for slowing down and change z axis
        this.sloBoost = p5.Vector.mult(this.accBoost, -1);
        // }

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

    // move(mover, primaryAcc, secondaryAcc) {
    move() {

        if (this.pos < this.accA) {
            // start
            this.acc = this.accBoost;
            // console.log("accelerate");

        } else if (this.pos >= this.accA && this.pos < this.accB) {
            // full speed
            this.acc = createVector(0, 0, 0);
            // console.log("full speed");

        } else if (this.pos >= p5.Vector.sub(this.end, this.OkLevel)) {
            // stop
            this.acc = createVector(0, 0, 0);
            this.vel = createVector(0, 0, 0);
            // console.log("stop");
            this.alive = false;  // reaching the goal of one axis is enough (xy & yx case)
        } else if (this.pos >= this.accB && this.pos < this.end) {
            // slow down
            this.acc = this.sloBoost;
            // console.log("slow down");
        }
        // console.log("pos x: " + mover + " end: " + this.end);
        this.vel.add(this.acc);
        this.pos.add(this.vel);

        // if (this.orientation == "x") {
        // this.pos.y = this.start2 + this.noisesY[Math.round(mover)];
        // } else if (this.orientation == "y") {
        // this.pos.x = this.start2 + this.noisesY[Math.round(mover)];
        // } else if (this.orientation == "xy") {
        // }
        // MISSING THE NOISE

    }

    update() {

        // if (this.orientation == "x") {
        //     this.move(this.pos.x, this.accA, this.accB);
        // } else if (this.orientation == "y") {
        //     this.move(this.pos.y, this.accA, this.accB);
        // } else if (this.orientation == "xy" || this.orientation == "yx") {
        // this.move(this.pos.x, this.accA, this.accB);
        // this.move(this.pos.y, this.accA2, this.accB2);
        this.move();
        // }

        this.radius = map(this.vel.x, 0, 3, 2.75, 1.75)
    }

    display() {

        if (MODE >= 5) {
            // start
            push();
            // strokeWeight(3);
            // stroke(255, 255, 0);
            translate(-width / 2, -height / 2);
            translate(this.start);
            // line(0, 0, this.Distance.x, this.Distance.y);
            // line(0, 0, this.Distance.x / 4, this.Distance.y / 4);
            fill("blue");
            ellipse(0, 0, 10);
            pop();

            // accA
            push();
            translate(-width / 2, -height / 2);
            translate(this.accA);
            noStroke();
            fill("red");
            ellipse(0, 0, 5);
            stroke(5);
            // line(0, 0, this.Distance.x, this.Distance.y);
            pop();


            // accB
            push();
            translate(-width / 2, -height / 2);
            translate(this.accB);
            noStroke();
            fill("red");
            ellipse(0, 0, 5);
            pop();


            // end
            push();
            translate(-width / 2, -height / 2);
            translate(this.end);
            noStroke();
            fill("purple");
            ellipse(0, 0, 10);
            pop();
        }

        if (this.alive) {

            push();
            translate(-width / 2, -height / 2);
            translate(this.pos);
            if (MODE >= 5) {
                noStroke();
                // fill(this.fillColor);
                fill("black");
                ellipse(0, 0, this.radius * 3, this.radius * 3);
            } else {
                strokeWeight(this.strokeSize);
                stroke(this.strokeColor);
                noFill();
                // sphere(this.radius);
                ellipse(0, 0, this.radius, this.radius);
            }
            pop();

        }
    }


}