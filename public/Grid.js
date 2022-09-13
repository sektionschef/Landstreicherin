
class Grid {
    constructor() {
        this.minimumDistance = 50;
        this.padding = 50;

        this.boxes = [];
        // this.virtual_boxes = [];
        // this.real_boxes = [];
        this.possible_pairings_x = [];
        this.possible_pairings_y = [];
        this.boxes_completely_run = false;

        this.count_of_points_x = Math.round(getRandomFromInterval(1, 3));  // 1-5
        this.count_of_points_y = Math.round(getRandomFromInterval(1, 3));  // 1-5
        this.grid_label = this.count_of_points_x + "x" + this.count_of_points_y;
        console.log("Grid: " + this.grid_label);

        this.columns_count = this.count_of_points_x + 1;
        this.row_count = this.count_of_points_y + 1;
        this.boxes_count = (this.columns_count) * (this.row_count)
        console.log("Grid with " + this.columns_count + " columns, " + this.row_count + " rows, " + this.boxes_count + " boxes and " + this.pairing_count + " planned pairings.")

        this.pairing_count = Math.floor(getRandomFromInterval(1, 4));
        // this.pairing_count = 0;
        console.log("Number of pairing: " + this.pairing_count);

        this.getPoints();
        this.create_unpaired_boxes();

        this.scout_possible_pairings();

        for (var i = 0; i < this.pairing_count; i++) {
            if (this.pairing_count > 0 && this.possible_pairings_x.length > 0 && this.possible_pairings_y.length > 0) {
                this.choose_pairing();
                this.pair();
                this.remove_used_pairs();
            }
        }
        console.log("The real boxes are:");
        console.log(this.boxes);

        this.create_lines();
    }


    getPoints() {

        // start
        this.pointsXPool = [...Array(width).keys()];
        this.pointsYPool = [...Array(height).keys()];

        // remove start and end of axis
        for (var i = this.pointsXPool.length - 1; i >= 0; i--) {
            if (i <= (0 + this.padding + this.minimumDistance) || i >= (width - this.padding - this.minimumDistance)) {
                this.pointsXPool.splice(i, 1);
            }
        }
        // console.log(this.pointsXPool);

        this.pointsX = [(0 + this.padding), (width - this.padding)];

        for (var i = this.pointsYPool.length - 1; i >= 0; i--) {
            if (i <= (0 + this.padding + this.minimumDistance) || i >= (height - this.padding - this.minimumDistance)) {
                this.pointsYPool.splice(i, 1);
            }
        }
        this.pointsY = [(0 + this.padding), (height - this.padding)];

        for (var i = 0; i < this.count_of_points_x; i++) {
            this.getSinglePointX();
        }

        for (var i = 0; i < this.count_of_points_y; i++) {
            this.getSinglePointY();
        }


        // simple sort
        this.pointsX.sort(function (a, b) {
            return a - b;
        });
        this.pointsY.sort(function (a, b) {
            return a - b;
        });

        console.log("Coordinates of points on x axis: " + this.pointsX);
        console.log("Coordinates of points on y axis: " + this.pointsY);
    }

    getSinglePointX() {
        let chosen_one = getRandomFromList(this.pointsXPool);
        // console.log(chosen_one);

        // remove near points
        for (var i = this.pointsXPool.length - 1; i >= 0; i--) {
            if (this.pointsXPool[i] >= (chosen_one - this.minimumDistance) && this.pointsXPool[i] <= (chosen_one + this.minimumDistance)) {
                this.pointsXPool.splice(i, 1);
            }
        }
        // console.log(this.pointsXPool);
        this.pointsX.push(chosen_one);
    }

    getSinglePointY() {
        let chosen_one = getRandomFromList(this.pointsYPool);
        // console.log(chosen_one);

        // remove near points
        for (var i = this.pointsYPool.length - 1; i >= 0; i--) {
            if (this.pointsYPool[i] >= (chosen_one - this.minimumDistance) && this.pointsYPool[i] <= (chosen_one + this.minimumDistance)) {
                // console.log(chosen_one + ": " + i);
                this.pointsYPool.splice(i, 1);
            }
        }
        // console.log(this.pointsYPool);
        this.pointsY.push(chosen_one);
    }

    create_unpaired_boxes() {
        this.label_counter = 0;

        for (let v = 0; v < (this.row_count); v++) {
            for (let i = 0; i < (this.columns_count); i++) {
                this.label_counter += 1;

                let data = {
                    label: (this.label_counter),
                    a: createVector(this.pointsX[i], this.pointsY[v]),
                    b: createVector(this.pointsX[i + 1], this.pointsY[v]),
                    c: createVector(this.pointsX[i + 1], this.pointsY[v + 1]),
                    d: createVector(this.pointsX[i], this.pointsY[v + 1])
                }

                this.boxes.push(new Box(data))
            }
        }
        // console.log("Unpaired Boxes:")
        // console.log(this.boxes)
    }

    scout_possible_pairings() {

        // skip boxes at the end of the row
        for (let i = 0; i < this.boxes.length; i++) {
            if (this.boxes[i].label % this.columns_count != 0) {
                this.possible_pairings_x.push({
                    left: this.boxes[i].label,
                    right: this.boxes[(i + 1)].label
                })
            }
            // skip last row
            if (this.boxes[i].label <= (this.boxes.length - this.columns_count)) {
                this.possible_pairings_y.push({
                    left: this.boxes[i].label,
                    // right: this.boxes[(i + this.row_count + 1)].label  // next row
                    right: this.boxes[(i + this.columns_count)].label  // next row
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

        for (let box of this.boxes) {
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
            let data = {
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
            this.paired_box = new Box(data);
        } else {
            let data = {
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
            this.paired_box = new Box(data);
        }

        console.log("Adding the newly paired box: ");
        console.log(this.paired_box);

        this.boxes.push(this.paired_box)

        console.log("Remove original boxes from array.");
        for (var i = this.boxes.length - 1; i >= 0; i--) {
            if (this.boxes[i].label == this.left_label) {
                this.boxes.splice(i, 1);
            }
            if (this.boxes[i].label == this.right_label) {
                this.boxes.splice(i, 1);
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

    create_lines() {
        for (let box of this.boxes) {
            // box.lines = new Lines(box.a.x, box.a.y, box.b.x, box.c.y, PADDING_X, PADDING_Y, DISTANCE_BETWEEN_LINES);
            box.lines = new Lines(box.a.x, box.a.y, box.c.x, box.c.y, PADDING_X, PADDING_Y, DISTANCE_BETWEEN_LINES);
        }
    }


    show() {

        for (let box of this.boxes) {
            box.show();
        }
    }

    show_lines() {

        for (let box of this.boxes) {
            box.lines.show();
        }
    }

    check_boxes_complete() {

        this.boxes_completely_run = true;

        for (let box_real of this.boxes) {
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

        // this.center_x = (this.b.x - this.a.x) / 2
        // this.center_y = (this.d.y - this.a.y) / 2

        this.radiusX = (this.b.x - this.a.x) / 2
        this.radiusY = (this.d.y - this.a.y) / 2

        this.center_x = this.a.x + this.radiusX;
        this.center_y = this.a.y + this.radiusY;
    }

    show() {
        if (MODE >= 5) {
            push();
            rectMode(CENTER);
            translate(this.center_x - width / 2, this.center_y - height / 2);
            noFill();
            strokeWeight(1);
            stroke(51);
            rect(0, 0, this.radiusX * 2, this.radiusY * 2);
            fill(0)
            ellipse(0, 0, 2);
            textFont(font);
            textSize(20);
            text(this.label, 10, 20);
            pop();
        }
    }
}

