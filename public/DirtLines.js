
class dirtLines {

    constructor(data) {

        if (typeof data === 'undefined') {
            data = {
                custom_width: width,
                custom_height: height,
                margin: 50,
                posX: 0,
                posY: 0,
                strokeColor: color(70),
                strokeWeight: 0.1,
                strokeColorNoise: 0,
                numberQuantisizer: 3,
                length: 80,
            }
        }

        this.custom_width = data.custom_width;
        this.custom_height = data.custom_height;
        this.margin = data.margin;
        this.pos = createVector(data.posX, data.posY);
        this.strokeColor = data.strokeColor;
        this.strokeWeight = data.strokeWeight;
        this.strokeColorNoise = data.strokeColorNoise;
        this.numberQuantisizer = data.numberQuantisizer;
        this.length = data.length;

        this.area = this.custom_width * this.custom_height;
        this.shapeNumber = this.area / 1000 * this.numberQuantisizer;  // relative to size

        this.elements = [];

        for (var i = 0; i < this.shapeNumber; i++) {

            this.start = createVector(getRandomFromInterval((0 + this.margin), (this.custom_width - this.margin)), getRandomFromInterval((0 + this.margin), (this.custom_height - this.margin)));
            this.end = p5.Vector.add(this.start, createVector(getRandomFromInterval(-this.length, this.length), getRandomFromInterval(-this.length, this.length)));

            this.elements.push({
                strokeColor: distortColorNew(this.strokeColor, this.strokeColorNoise),
                strokeWeight: this.strokeWeight,
                // position: createVector(getRandomFromInterval(this.margin, this.custom_width - this.margin), getRandomFromInterval(this.margin, this.custom_height - this.margin))
                start: this.start,
                end: this.end
            })
        }
    }

    show() {

        push();
        translate(this.pos.x, this.pos.y);

        for (var element of this.elements) {
            stroke(element.strokeColor);
            strokeWeight(element.strokeWeight);
            // line(getRandomFromInterval(0, width), getRandomFromInterval(0, height), getRandomFromInterval(0, width), getRandomFromInterval(0, height));
            line(element.start.x, element.start.y, element.end.x, element.end.y);
        }
        pop();

        if (MODE >= 5) {
            push();
            noFill();
            strokeWeight(2);
            stroke("#000000");
            rectMode(CENTER);
            rect(0, 0, this.custom_width - this.margin * 2, this.custom_height - this.margin * 2);
            pop();
        }
    }

}