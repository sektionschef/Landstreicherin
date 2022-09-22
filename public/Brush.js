class Brush {
    constructor(start, end, colorObject) {
        this.fullspeed = 5;
        this.radius = 0.5;
        this.distanceBoost = 4; // 4 faster, 8 slower, but thicker - where the points are
        this.noiseYzoom = 0.007;  // zoom on noise
        this.amplitudeNoiseY = 3.5;  // up and down on Y axis
        this.OkLevel = 8;  // some offset is ok.
        this.fillColor = colorObject;  // color(180);
        this.strokeColor = colorObject; // color("#c79712");
        this.strokeSize = 0.5;

        this.start = start;
        this.end = end;

        this.alive = true;
        this.passedA = false;
        this.passedB = false;

        this.pos = this.start.copy();

        this.vel = createVector(0, 0, 0);
        this.acc = createVector(0, 0, 0);
        this.Distance = p5.Vector.sub(this.end, this.start);
        this.DistanceLength = this.Distance.mag();

        this.distAccSlo = this.DistanceLength / this.distanceBoost;  // distance for acceleration and slow down
        this.boost = this.fullspeed / this.distAccSlo;
        this.checkpointA = p5.Vector.add(this.start, p5.Vector.div(this.Distance, this.distanceBoost));  // distance for full speed
        this.checkpointB = p5.Vector.sub(this.end, p5.Vector.div(this.Distance, this.distanceBoost));  // distance for full speed

        // console.log("accdist: " + this.distAccSlo);
        // console.log("boost: " + this.boost);
        // console.log("step: " + this.distAccSlo / this.boost);

        this.accBoost = p5.Vector.mult(p5.Vector.normalize(this.Distance), this.boost);
        this.sloBoost = p5.Vector.mult(this.accBoost, -1);

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

    move() {

        if (this.pos.dist(this.end) <= this.OkLevel) {
            this.alive = false;  // reaching the goal of one axis is enough (xy & yx case)
        } else if (this.pos.dist(this.checkpointA) <= 2) {
            this.passedA = true;
        } else if (this.pos.dist(this.checkpointB) <= 2) {
            this.passedB = true;

        }
        if (this.passedA == false) {
            // console.log("accelerate");
            this.acc = this.accBoost;
        } else if (this.passedA == true && this.passedB == false) {
            // console.log("full speed");
            this.acc = createVector(0, 0, 0);
            // this.acc = createVector(getRandomFromInterval(-0.001, 0.001), getRandomFromInterval(-0.001, 0.001), 0);
        } else if (this.passedA == true && this.passedB == true) {
            // console.log("slow down");
            this.acc = this.sloBoost;
        } else if (this.alive == false) {
            // console.log("stop");
            this.acc = createVector(0, 0, 0);
            this.vel = createVector(0, 0, 0);
        }


        // if (this.pos < this.checkpointA) {
        //     // start
        //     this.acc = this.accBoost;
        //     // console.log("accelerate");

        // } else if (this.pos >= this.checkpointA && this.pos < this.checkpointB) {
        //     // full speed
        //     this.acc = createVector(0, 0, 0);
        //     // console.log("full speed");

        // } else if (this.end.dist(this.pos) <= this.OkLevel) {
        //     // stop
        //     this.acc = createVector(0, 0, 0);
        //     this.vel = createVector(0, 0, 0);
        //     // console.log("stop");
        //     this.alive = false;  // reaching the goal of one axis is enough (xy & yx case)
        // } else if (this.pos >= this.checkpointB && this.pos < this.end) {
        //     // slow down
        //     this.acc = this.sloBoost;
        //     // console.log("slow down");
        // }


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

        if (this.alive) {
            this.move();
            if (this.vel.x > 0) {
                this.radius = map(this.vel.x, 0, 3, 2.75, 1.75)
            } else if (this.vel.y > 0) {
                this.radius = map(this.vel.y, 0, 3, 2.75, 1.75)
            }
        }

    }

    display() {

        if (MODE >= 5) {
            // start
            push();
            translate(-width / 2, -height / 2);
            translate(this.start);
            noStroke();
            fill("blue");
            ellipse(0, 0, 10);
            pop();

            // accA
            push();
            translate(-width / 2, -height / 2);
            translate(this.checkpointA);
            noStroke();
            fill("red");
            ellipse(0, 0, 5);
            stroke(5);
            pop();


            // accB
            push();
            translate(-width / 2, -height / 2);
            translate(this.checkpointB);
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
                noStroke();
                strokeWeight(this.strokeSize);
                stroke(this.strokeColor);
                noFill();
                // sphere(this.radius);
                // fill(this.fillColor);
                // rotate(frameCount % 3);
                rectMode(CENTER);
                // ellipse(0, 0, this.radius, this.radius);
                rect(0, 0, this.radius, this.radius);
            }
            pop();

        }
    }


}