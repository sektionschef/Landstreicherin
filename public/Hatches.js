STROKE_COLOR = "black";
STROKE_NOISE = 1;
STROKE_NOISE_2 = 1;
STROKE_DISTORT = 1;


class Hatches {
    constructor(axis, cornerLeft, cornerRight, padding_x, padding_y, distance_between_lines) {
        this.axis = axis;
        this.cornerLeft = cornerLeft  // createVector(x_start, y_start);
        this.cornerRight = cornerRight // createVector(x_stop, y_stop);
        this.padding_x = padding_x;
        this.padding_y = padding_y;
        this.distance_between_lines = distance_between_lines;

        this.bodies = [];
        this.all_lines_complete = false;

        this.width = this.cornerRight.x - this.cornerLeft.x;
        this.height = this.cornerRight.y - this.cornerLeft.y;


        if (this.axis == "x") {
            this.x();
        } else if (this.axis == "y") {
            this.y();
        } else if (this.axis == "xy") {
            this.xy();
        } else if (this.axis == "yx") {
            this.yx();
        } else if (this.axis == "blank") {
        }
    }

    x() {

        let count_lines;
        let start;
        let end;

        count_lines = ((this.cornerRight.y - this.cornerLeft.y) - 2 * this.padding_y) / this.distance_between_lines;

        for (let i = 0; i < count_lines; i++) {

            start = createVector(this.cornerLeft.x + this.padding_x, this.cornerLeft.y + this.padding_y + this.distance_between_lines * i, 0);
            end = createVector(this.cornerRight.x - this.padding_x, this.cornerLeft.y + this.padding_y + this.distance_between_lines * i, 0);

            // console.log(i);
            this.bodies.push(new Brush(
                start,
                end,
            ));
        }
    }

    y() {
        let count_lines;
        let start;
        let end;

        count_lines = Math.round(((this.cornerRight.x - this.cornerLeft.x) - 2 * this.padding_x) / this.distance_between_lines);

        for (let i = 0; i < count_lines; i++) {

            start = createVector(this.cornerLeft.x + this.padding_x + this.distance_between_lines * i, this.cornerLeft.y + this.padding_y);
            end = createVector(this.cornerLeft.x + this.padding_x + this.distance_between_lines * i, this.cornerRight.y - this.padding_x);

            this.bodies.push(new Brush(
                start,
                end,
            ));
        }
    }

    xy() {

        // y = kx + d
        // k = -1/1  - https://de.serlo.org/mathe/1785/geradensteigung
        // y = -1x + 0;  // line 1
        // y = cornerRight.x or y = cornerRight.y
        // intersection: cornerRight.x or cornerRight.y = -1x -> 

        let count_lines;
        let start;
        let end;
        let type;


        if (this.width < this.height) {
            type = "height"
        } else {
            type = "width"
        }

        // main body
        if (type == "height") {
            count_lines = (this.height - this.width - 2 * this.padding_x) / this.distance_between_lines;

            for (let i = 0; i < count_lines; i++) {

                start = createVector(this.cornerLeft.x, this.cornerLeft.y + this.distance_between_lines * i, 0);
                end = createVector(this.cornerRight.x, this.cornerLeft.y + (this.cornerRight.x - this.cornerLeft.x) + this.distance_between_lines * i, 0);

                this.bodies.push(new Brush(
                    start,
                    end,
                ));
            }
        } else {

            count_lines = (this.width - this.height - 2 * this.padding_x) / this.distance_between_lines;

            for (let i = 0; i < count_lines; i++) {

                start = createVector(this.cornerLeft.x + this.distance_between_lines * i, this.cornerLeft.y, 0);
                end = createVector(this.cornerLeft.x + this.height + this.distance_between_lines * i, this.cornerRight.y, 0);

                this.bodies.push(new Brush(
                    start,
                    end,
                ));
            }

        }

        if (type == "height") {
            // triangle beneath
            // console.log(this.height - this.width);
            count_lines = (this.width - 2 * this.padding_x) / this.distance_between_lines;

            for (let i = 0; i < count_lines; i++) {  // skip first line

                start = createVector(this.cornerLeft.x, this.cornerLeft.y + (this.height - this.width) + this.distance_between_lines * i);
                end = createVector(this.cornerRight.x - this.distance_between_lines * i, this.cornerRight.y);

                this.bodies.push(new Brush(
                    start,
                    end
                ));
            }

        } else {

            // left to floor
            count_lines = (this.height - 2 * this.padding_x) / this.distance_between_lines;

            for (let i = 1; i < count_lines; i++) {  // skip first line

                start = createVector(this.cornerLeft.x, this.cornerLeft.y + this.distance_between_lines * i);
                end = createVector(this.cornerLeft.x + this.height - this.distance_between_lines * i, this.cornerRight.y);

                this.bodies.push(new Brush(
                    start,
                    end
                ));
            }
        }

        if (type == "height") {

            // // triangle beneath
            count_lines = (this.width - 2 * this.padding_x) / this.distance_between_lines;

            for (let i = 1; i < count_lines; i++) {  // skip first line

                start = createVector(this.cornerLeft.x + this.distance_between_lines * i, this.cornerLeft.y);
                end = createVector(this.cornerRight.x, this.cornerRight.y - (this.height - this.width) - this.distance_between_lines * i);

                this.bodies.push(new Brush(
                    start,
                    end,
                ));
            }
        } else {

            // // triangle ceiling to right
            count_lines = (this.height - 2 * this.padding_x) / this.distance_between_lines;

            for (let i = 0; i < count_lines; i++) {  // skip first line

                start = createVector(this.cornerRight.x - this.height + this.distance_between_lines * i, this.cornerLeft.y);
                end = createVector(this.cornerRight.x, this.cornerRight.y - this.distance_between_lines * i);

                this.bodies.push(new Brush(
                    start,
                    end,
                ));
            }

        }

    }


    yx() {
        let count_lines;
        let start;
        let end;
        let type;

        if (this.width < this.height) {
            type = "height"
        } else {
            type = "width"
        }



        if (type == "height") {
            count_lines = (this.height - this.width - 2 * this.padding_x) / this.distance_between_lines;
            // main body




            for (let i = 0; i < count_lines; i++) {

                start = createVector(this.cornerLeft.x, this.cornerLeft.y + (this.cornerRight.x - this.cornerLeft.x) + this.distance_between_lines * i, 0);
                end = createVector(this.cornerRight.x, this.cornerLeft.y + this.distance_between_lines * i, 0);

                this.bodies.push(new Brush(
                    start,
                    end,
                ));
            }
        } else {
            // main body
            count_lines = (this.width - this.height) / this.distance_between_lines;

            for (let i = 0; i < count_lines; i++) {
                // + (this.height - this.width)
                start = createVector(this.cornerLeft.x + this.distance_between_lines * i, this.cornerRight.y);
                end = createVector(this.cornerLeft.x + this.height + this.distance_between_lines * i, this.cornerLeft.y);

                this.bodies.push(new Brush(
                    start,
                    end
                ));
            }

        }

        if (type == "height") {
            // triangle beneath
            count_lines = (this.width - 2 * this.padding_x) / this.distance_between_lines;


            for (let i = 0; i < count_lines; i++) {
                // + (this.height - this.width)
                start = createVector(this.cornerLeft.x, this.cornerLeft.y + this.distance_between_lines * i);
                end = createVector(this.cornerLeft.x + this.distance_between_lines * i, this.cornerLeft.y);

                this.bodies.push(new Brush(
                    start,
                    end
                ));
            }
        } else {
            // floor to right
            count_lines = (this.height - 2 * this.padding_x) / this.distance_between_lines;

            for (let i = 0; i < count_lines; i++) {

                start = createVector(this.cornerRight.x - this.height + this.distance_between_lines * i, this.cornerRight.y, 0);
                end = createVector(this.cornerRight.x, this.cornerLeft.y + this.distance_between_lines * i, 0);

                this.bodies.push(new Brush(
                    start,
                    end,
                ));
            }

        }


        if (type == "height") {
            // // // triangle beneath
            count_lines = (this.width - 2 * this.padding_x) / this.distance_between_lines;

            for (let i = 0; i < count_lines; i++) {

                start = createVector(this.cornerLeft.x + this.distance_between_lines * i, this.cornerRight.y);
                end = createVector(this.cornerRight.x, this.cornerRight.y - this.width + this.distance_between_lines * i);

                this.bodies.push(new Brush(
                    start,
                    end,
                ));
            }
        } else {
            // left to ceiling
            count_lines = (this.height - 2 * this.padding_x) / this.distance_between_lines;

            for (let i = 0; i < count_lines; i++) {

                start = createVector(this.cornerLeft.x, this.cornerLeft.y + this.distance_between_lines * i);
                end = createVector(this.cornerLeft.x + this.distance_between_lines * i, this.cornerLeft.y);

                this.bodies.push(new Brush(
                    start,
                    end,
                ));
            }

        }

    }

    show() {

        this.check_all_complete();

        if (MODE >= 5) {
            push();
            translate(-width / 2, -height / 2);
            translate(this.cornerLeft.x + this.width / 2, this.cornerLeft.y + this.height / 2, 0)
            fill(255, 255, 255, 100);
            box(this.width, this.height, 0);
            pop();
        }

        if (this.all_lines_complete == false) {
            for (var brush of this.bodies) {
                brush.update();
                brush.display();
            }
        }

    }

    check_all_complete() {
        // skip if already complete
        if (this.all_lines_complete == false) {
            this.all_lines_complete = true;
            for (var brush of this.bodies) {
                if (brush.alive) {
                    this.all_lines_complete = false;
                }
            }
        } else {
            // console.log("all drawn");
        }
    }
}

