STROKE_COLOR = "black";
STROKE_NOISE = 1;
STROKE_NOISE_2 = 1;
STROKE_DISTORT = 1;


class Lines {
    constructor(x_start, y_start, x_stop, y_stop, padding_x, padding_y, distance_between_lines) {
        this.x_start = x_start;
        this.y_start = y_start;
        this.x_stop = x_stop;
        this.y_stop = y_stop;
        this.padding_x = padding_x;
        this.padding_y = padding_y;
        this.distance_between_lines = distance_between_lines;

        this.bodies = [];
        this.all_lines_complete = false;

        // let this.chosen_axis = getRandomFromList(["x", "y", "xy", "yx", "blank"]);
        // let this.chosen_axis = getRandomFromList(["x", "y", "xy", "blank"]);
        this.chosen_axis = getRandomFromList(["xy"]);
        console.log(this.chosen_axis + " axis randomly chosen.");

        if (this.chosen_axis == "x") {
            this.count_lines = ((this.y_stop - this.y_start) - 2 * this.padding_y) / this.distance_between_lines;

            for (let i = 0; i < this.count_lines; i++) {
                // console.log(i);
                this.bodies.push(new Brush(
                    this.chosen_axis,
                    this.x_start + this.padding_x,
                    this.x_stop - this.padding_x,
                    this.y_start + this.padding_y + this.distance_between_lines * i,
                ));
            }
        } else if (this.chosen_axis == "y") {

            this.count_lines = ((this.x_stop - this.x_start) - 2 * this.padding_x) / this.distance_between_lines;

            for (let i = 0; i < this.count_lines; i++) {
                this.bodies.push(new Brush(
                    this.chosen_axis,
                    (this.y_start + this.padding_y),
                    (this.y_stop - this.padding_x),
                    (this.x_start + this.padding_x + this.distance_between_lines * i)
                ));
            }
        } else if (this.chosen_axis == "xy") {

            this.count_lines = ((this.x_stop - this.x_start) - 2 * this.padding_x) / this.distance_between_lines;

            for (let i = 0; i < this.count_lines; i++) {

                // getting
                // console.log(this.chosen_axis, this.x_start + this.padding_x,
                //     this.x_stop - this.padding_x,
                //     this.y_start + this.padding_y + this.distance_between_lines * i
                // )
                // // asdfasfaf

                this.bodies.push(new Brush(
                    this.chosen_axis,
                    (this.x_start + this.padding_x + this.distance_between_lines * i),
                    this.x_stop - this.padding_x,
                    (this.y_start + this.padding_y),
                    (this.y_stop - this.padding_y)
                ));
            }
            this.count_lines = ((this.y_stop - this.y_start) - 2 * this.padding_y) / this.distance_between_lines;


            for (let i = 1; i < this.count_lines; i++) {
                // console.log(
                //     this.chosen_axis,
                //     (this.x_start + this.padding_x),
                //     this.x_stop - this.padding_x,
                //     (this.y_start + this.padding_y + this.distance_between_lines * i),
                //     (this.y_stop - this.padding_y))


                // skip first one
                this.bodies.push(new Brush(
                    this.chosen_axis,
                    (this.x_start + this.padding_x),
                    this.x_stop - this.padding_x,
                    (this.y_start + this.padding_y + this.distance_between_lines * i),
                    (this.y_stop - this.padding_y)));
            }
        } else if (this.chosen_axis == "yx") {
            this.count_lines = ((this.x_stop - this.x_start) - 2 * this.padding_x) / this.distance_between_lines;

            for (let i = 0; i < this.count_lines; i++) {
                this.bodies.push(new Brush(
                    this.chosen_axis,
                    this.x_start + this.padding_x + this.distance_between_lines * i,
                    (this.x_stop - this.padding_x),
                    (this.y_stop - this.padding_y),
                    (this.y_start + this.padding_y)
                )
                );
            }
            this.count_lines = ((this.y_stop - this.y_start) - 2 * this.padding_y) / this.distance_between_lines;

            for (let i = 1; i < this.count_lines; i++) {
                this.bodies.push(new Brush(
                    this.chosen_axis,
                    this.x_start + this.padding_x,
                    (this.x_stop - this.padding_x),
                    (this.y_stop - this.padding_y - this.distance_between_lines * i),
                    (this.y_start + this.padding_y)
                )
                );
            }
        } else if (this.chosen_axis == "blank") {
        }
    }

    show() {

        for (var brush of this.bodies) {
            brush.update();
            brush.display();
        }

    }

    // check_all_complete() {
    //     // skip if already complete
    //     if (this.all_lines_complete == false) {
    //         this.all_lines_complete = true;
    //         for (var line of this.bodies) {
    //             if (line.run_complete == false) {
    //                 this.all_lines_complete = false;
    //             }
    //         }
    //     }
    // }
}



class Hatches {
    constructor(x_start, y_start, x_stop, y_stop, padding_x, padding_y, distance_between_lines) {
        // this.x_start = x_start;
        // this.y_start = y_start;
        this.cornerLeft = createVector(x_start, y_start);
        // this.x_stop = x_stop;
        // this.y_stop = y_stop;
        this.cornerRight = createVector(x_stop, y_stop);
        this.padding_x = padding_x;
        this.padding_y = padding_y;
        this.distance_between_lines = distance_between_lines;

        this.bodies = [];
        this.all_lines_complete = false;

        this.width = this.cornerRight.x - this.cornerLeft.x;
        this.height = this.cornerRight.y - this.cornerLeft.y;

        // let this.chosen_axis = getRandomFromList(["x", "y", "xy", "yx", "blank"]);
        // let this.chosen_axis = getRandomFromList(["x", "y", "xy", "blank"]);
        this.chosen_axis = getRandomFromList(["xy"]);
        console.log(this.chosen_axis + " axis randomly chosen.");

        if (this.chosen_axis == "x") {
            this.count_lines = ((this.y_stop - this.y_start) - 2 * this.padding_y) / this.distance_between_lines;

            for (let i = 0; i < this.count_lines; i++) {
                // console.log(i);
                this.bodies.push(new Brush(
                    this.chosen_axis,
                    this.x_start + this.padding_x,
                    this.x_stop - this.padding_x,
                    this.y_start + this.padding_y + this.distance_between_lines * i,
                ));
            }
        } else if (this.chosen_axis == "y") {

            this.count_lines = ((this.x_stop - this.x_start) - 2 * this.padding_x) / this.distance_between_lines;

            for (let i = 0; i < this.count_lines; i++) {
                this.bodies.push(new Brush(
                    this.chosen_axis,
                    (this.y_start + this.padding_y),
                    (this.y_stop - this.padding_x),
                    (this.x_start + this.padding_x + this.distance_between_lines * i)
                ));
            }
        } else if (this.chosen_axis == "xy") {
            this.xy();
        } else if (this.chosen_axis == "yx") {
            this.count_lines = ((this.x_stop - this.x_start) - 2 * this.padding_x) / this.distance_between_lines;

            for (let i = 0; i < this.count_lines; i++) {
                this.bodies.push(new Brush(
                    this.chosen_axis,
                    this.x_start + this.padding_x + this.distance_between_lines * i,
                    (this.x_stop - this.padding_x),
                    (this.y_stop - this.padding_y),
                    (this.y_start + this.padding_y)
                )
                );
            }
            this.count_lines = ((this.y_stop - this.y_start) - 2 * this.padding_y) / this.distance_between_lines;

            for (let i = 1; i < this.count_lines; i++) {
                this.bodies.push(new Brush(
                    this.chosen_axis,
                    this.x_start + this.padding_x,
                    (this.x_stop - this.padding_x),
                    (this.y_stop - this.padding_y - this.distance_between_lines * i),
                    (this.y_start + this.padding_y)
                )
                );
            }
        } else if (this.chosen_axis == "blank") {
        }
    }

    xy() {

        let v = createVector(1, -1);
        let w = createVector(0, -1);

        // y = kx + d
        // k = -1/1  - https://de.serlo.org/mathe/1785/geradensteigung
        // y = -1x + 0;  // line 1
        // y = cornerRight.x or y = cornerRight.y
        // intersection: cornerRight.x or cornerRight.y = -1x -> 


        if (this.width < this.height) {
            this.count_lines = (this.width - 2 * this.padding_x) / this.distance_between_lines;
        } else {
            this.count_lines = (this.height - 2 * this.padding_x) / this.distance_between_lines;
        }


        for (let i = 0; i < this.count_lines; i++) {

            // this.width - this.distance_between_lines * i;
            // this.height - this.distance_between_lines * i;

            //     // getting
            //     // console.log(this.chosen_axis, this.x_start + this.padding_x,
            //     //     this.x_stop - this.padding_x,
            //     //     this.y_start + this.padding_y + this.distance_between_lines * i
            //     // )
            //     // // asdfasfaf

            this.bodies.push(new Brush(
                this.chosen_axis,
                this.cornerLeft.x,
                this.cornerRight.x,
                this.cornerLeft.y + this.distance_between_lines * i,
                this.cornerLeft.y + (this.cornerRight.x - this.cornerLeft.x) + this.distance_between_lines * i,
            ));
        }
        // this.count_lines = ((this.y_stop - this.y_start) - 2 * this.padding_y) / this.distance_between_lines;


        // for (let i = 1; i < this.count_lines; i++) {
        // console.log(
        //     this.chosen_axis,
        //     (this.x_start + this.padding_x),
        //     this.x_stop - this.padding_x,
        //     (this.y_start + this.padding_y + this.distance_between_lines * i),
        //     (this.y_stop - this.padding_y))


        // skip first one
        // this.bodies.push(new Brush(
        //     this.chosen_axis,
        //     (this.x_start + this.padding_x),
        //     this.x_stop - this.padding_x,
        //     (this.y_start + this.padding_y + this.distance_between_lines * i),
        //     (this.y_stop - this.padding_y)));
        // }
    }

    show() {

        push();
        translate(-width / 2, -height / 2);
        translate(this.x_start + this.width / 2, this.y_start + this.height / 2, 0)
        fill("white");
        box(this.width, this.height, 0);
        pop();


        // if (MODE >= 5) {
        //     if (this.chosen_axis == "xy") {
        //         push();
        //         translate(-width / 2, -height / 2);
        //         triangle(this.cornerLeft.x, this.cornerLeft.y, this.cornerLeft.x, this.cornerRight.y, this.cornerRight.x, this.cornerRight.y)
        //         pop();
        //     }
        // }

        for (var brush of this.bodies) {
            brush.update();
            brush.display();
        }

    }

    // check_all_complete() {
    //     // skip if already complete
    //     if (this.all_lines_complete == false) {
    //         this.all_lines_complete = true;
    //         for (var line of this.bodies) {
    //             if (line.run_complete == false) {
    //                 this.all_lines_complete = false;
    //             }
    //         }
    //     }
    // }
}

