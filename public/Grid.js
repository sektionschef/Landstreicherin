
class Grid {
    constructor() {

        this.count_of_points_x = Math.round(getRandomFromInterval(1, 5));  // 1-5
        this.count_of_points_y = Math.round(getRandomFromInterval(1, 5));  // 1-5
        this.grid_label = this.count_of_points_x + "x" + this.count_of_points_y;
        console.log("Grid: " + this.grid_label);

        // this.pairing_count = Math.floor(getRandomFromInterval(1, 4));
        this.pairing_count = 0;
        console.log("Number of pairing: " + this.pairing_count);

        for (let i = 0; i < this.count_of_points_x; i++) {
            width_points.push(Math.floor(getRandomFromInterval(0, (width - MINIMIMUM_DISTANCE))));
        }
        for (let i = 0; i < this.count_of_points_y; i++) {
            height_points.push(Math.floor(getRandomFromInterval(0, (height - MINIMIMUM_DISTANCE))));
        }

        // add width and height
        width_points.push(width);
        height_points.push(height);

        // simple sort
        width_points.sort(function (a, b) {
            return a - b;
        });
        height_points.sort(function (a, b) {
            return a - b;
        });

        for (var i = width_points.length - 1; i >= 0; i--) {
            if ((width_points[(i)] - width_points[i - 1]) < MINIMIMUM_DISTANCE) {
                if (width_points[i] != width) {  // do not remove the width value
                    width_points.splice(i, 1);
                }
            }
        }

        for (var i = height_points.length - 1; i >= 0; i--) {
            if ((height_points[(i)] - height_points[i - 1]) < MINIMIMUM_DISTANCE) {
                if (height_points[i] != height) {
                    height_points.splice(i, 1);
                }
            }
        }

        console.log("Coordinates of points on x axis: " + width_points);
        console.log("Coordinates of points on y axis: " + height_points);

        this.width_points = width_points;
        this.height_points = height_points;
    }
}


class Boxes {

    constructor(width_points, height_points, pairing_count) {
        console.log("Creating boxes.");
        this.width_points = width_points;
        this.height_points = height_points;
        this.pairing_count = pairing_count;

        this.columns_count = this.width_points.length - 1;
        this.row_count = this.height_points.length - 1;
        this.boxes_count = (this.columns_count) * (this.row_count)
        console.log("Grid with " + this.columns_count + " columns, " + this.row_count + " rows, " + this.boxes_count + " boxes and " + this.pairing_count + " planned pairings.")


        this.virtual_boxes = [];
        this.possible_pairings_x = [];
        this.possible_pairings_y = [];
        this.real_boxes = [];

        this.boxes_completely_run = false;

        this.create_virtual_boxes();

        this.scout_possible_pairings();

        // populate the resulting boxes
        this.real_boxes = this.virtual_boxes;

        for (var i = 0; i < this.pairing_count; i++) {
            if (this.pairing_count > 0 && this.possible_pairings_x.length > 0 && this.possible_pairings_y.length > 0) {
                this.choose_pairing();
                this.pair();
                this.remove_used_pairs();
            }
        }
        console.log("The real boxes are:");
        console.log(this.real_boxes);

        // this.create_lines();
    }

    create_virtual_boxes() {
        this.label_counter = 0;

        for (let v = 0; v < (this.row_count); v++) {
            for (let i = 0; i < (this.columns_count); i++) {
                this.label_counter += 1;

                let data = {
                    label: (this.label_counter),
                    a: createVector(this.width_points[i], this.height_points[v]),
                    b: createVector(this.width_points[i + 1], this.height_points[v]),
                    c: createVector(this.width_points[i + 1], this.height_points[v + 1]),
                    d: createVector(this.width_points[i], this.height_points[v + 1])
                }

                this.virtual_boxes.push(new Box(data))
            }
        }
        console.log("Virtual boxes:")
        console.log(this.virtual_boxes)
    }

    scout_possible_pairings() {

        // skip boxes at the end of the row
        for (let i = 0; i < this.virtual_boxes.length; i++) {
            if (this.virtual_boxes[i].label % this.columns_count != 0) {
                this.possible_pairings_x.push({
                    left: this.virtual_boxes[i].label,
                    right: this.virtual_boxes[(i + 1)].label
                })
            }
            // skip last row
            if (this.virtual_boxes[i].label <= (this.virtual_boxes.length - this.columns_count)) {
                this.possible_pairings_y.push({
                    left: this.virtual_boxes[i].label,
                    // right: this.virtual_boxes[(i + this.row_count + 1)].label  // next row
                    right: this.virtual_boxes[(i + this.columns_count)].label  // next row
                })
            }
        }

        console.log(this.possible_pairings_x.length + " possible combinations for x:");
        console.log(this.possible_pairings_x);
        console.log(this.possible_pairings_y.length + " possible combinations for y: ");
        console.log(this.possible_pairings_y);
    }

    choose_pairing() {

        if (fxrand() >= 0.5) {
            this.chosen_axis = "x"
            this.chosen = getRandomFromList(this.possible_pairings_x)
            console.log("Pairing on the x axis with:");
            console.log(this.chosen);
        } else {
            this.chosen_axis = "y"
            this.chosen = getRandomFromList(this.possible_pairings_y)
            console.log("Pairing on the y axis with:");
            console.log(this.chosen);
        }
    }

    pair() {

        let left_temp;
        let right_temp;

        for (let box of this.virtual_boxes) {
            if (box.label == this.chosen.left) {
                left_temp = {
                    a: box.a, b: box.b, c: box.c, d: box.d
                }
                this.left_label = box.label
            } else if (box.label == this.chosen.right) {
                right_temp = {
                    a: box.a, b: box.b, c: box.c, d: box.d
                }
                this.right_label = box.label;
            } else {
            }
        }

        if (this.chosen_axis == "x") {
            this.paired_box = {
                label: this.left_label + "+" + this.right_label,
                a: {
                    x: left_temp.a.x,
                    y: left_temp.a.y
                },
                b: {
                    x: right_temp.b.x,
                    y: right_temp.b.y
                },
                c: {
                    x: right_temp.c.x,
                    y: right_temp.c.y
                },
                d: {
                    x: left_temp.d.x,
                    y: left_temp.d.y
                },
            };
        } else {
            this.paired_box = {
                label: this.left_label + "+" + this.right_label,
                a: {
                    x: left_temp.a.x,
                    y: left_temp.a.y
                },
                b: {
                    x: left_temp.b.x,
                    y: left_temp.b.y
                },
                c: {
                    x: right_temp.c.x,
                    y: right_temp.c.y
                },
                d: {
                    x: right_temp.d.x,
                    y: right_temp.d.y
                },
            };
        }

        console.log("Adding the newly paired box: ");
        console.log(this.paired_box);

        this.real_boxes.push(this.paired_box)

        console.log("Remove original boxes from array.");
        for (var i = this.real_boxes.length - 1; i >= 0; i--) {
            if (this.real_boxes[i].label == this.left_label) {
                this.real_boxes.splice(i, 1);
            }
            if (this.real_boxes[i].label == this.right_label) {
                this.real_boxes.splice(i, 1);
            }
        }
    }

    remove_used_pairs() {
        console.log("Remove used pairs from both pools.")
        for (var i = this.possible_pairings_x.length - 1; i >= 0; i--) {

            if (
                this.possible_pairings_x[i].left == this.chosen.left ||
                this.possible_pairings_x[i].left == this.chosen.right ||
                this.possible_pairings_x[i].right == this.chosen.left ||
                this.possible_pairings_x[i].right == this.chosen.right
            ) {
                this.possible_pairings_x.splice(i, 1);
            }
        }
        for (var i = this.possible_pairings_y.length - 1; i >= 0; i--) {
            if (
                this.possible_pairings_y[i].left == this.chosen.left ||
                this.possible_pairings_y[i].left == this.chosen.right ||
                this.possible_pairings_y[i].right == this.chosen.left ||
                this.possible_pairings_y[i].right == this.chosen.right
            ) {
                this.possible_pairings_y.splice(i, 1);
            }
        }
    }

    // create_lines() {
    //     for (let box_real of this.real_boxes) {
    //         box_real.lines = new Lines(box_real.a.x, box_real.a.y, box_real.b.x, box_real.c.y, PADDING_X, PADDING_Y, DISTANCE_BETWEEN_LINES);
    //     }
    // }


    show() {

        for (let box_real of this.real_boxes) {
            box_real.show();
        }
    }

    // show_lines() {

    //     for (let box_real of this.real_boxes) {
    //         box_real.lines.show();
    //     }
    // }

    check_boxes_complete() {

        this.boxes_completely_run = true;

        for (let box_real of this.real_boxes) {
            box_real.lines.check_all_complete();
            if (box_real.lines.all_lines_complete == false) {
                this.boxes_completely_run = false;
            }
        }
    }
}


class Box {
    constructor(data) {

        this.label = data.label;
        this.a = data.a;
        this.b = data.b;
        this.c = data.c;
        this.d = data.d;

        this.center_x = (this.b.x - this.a.x) / 2
        this.center_y = (this.d.y - this.a.y) / 2
    }

    show() {
        push();
        rectMode(CORNERS);
        translate(this.a.x - width / 2, this.a.y - height / 2);
        // fill(133);
        // fill(255);
        noFill();
        // if (logging.getLevel() <= 1) {
        strokeWeight(3);
        stroke(51);
        // } else {
        // noStroke();
        // }
        // if (logging.getLevel() <= 1) {
        rect(0, 0, this.c.x, this.c.y);
        fill(0)
        textFont(font);
        textSize(20);
        text(this.label, this.center_x, this.center_y);
        // }
        pop();
    }
}

