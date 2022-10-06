
class dirtLines {

    constructor(data) {

        if (typeof data === 'undefined') {
            data = {
                custom_width: width,
                custom_height: height,
                margin: 50,
                posX: 0,
                posY: 0,
                strokeColor: color(100),
                strokeWeight: 0.1,
                strokeColorNoise: 0,
                numberQuantisizer: 3,
                length: 80,
            }
        }

        this.custom_width = data.custom_width;
        this.custom_height = data.custom_height;
        this.margin = data.margin;
        this.posX = data.posX;
        this.posY = data.posY;
        this.strokeColor = data.strokeColor;
        this.strokeWeight = data.strokeWeight;
        this.strokeColorNoise = data.strokeColorNoise;
        this.numberQuantisizer = data.numberQuantisizer;
        this.length = data.length;

        this.colorObjectRed = red(this.strokeColor);
        this.colorObjectGreen = green(this.strokeColor);
        this.colorObjectBlue = blue(this.strokeColor);

        this.area = this.custom_width * this.custom_height;
        this.shapeNumber = this.area / 1000 * this.numberQuantisizer;  // relative to size

        this.elements = []

        for (var i = 0; i < this.shapeNumber; i++) {
            this.colorObjectRed = getRandomFromInterval(this.colorObjectRed - this.strokeColorNoise, this.colorObjectRed + this.strokeColorNoise);
            this.colorObjectGreen = getRandomFromInterval(this.colorObjectGreen - this.strokeColorNoise, this.colorObjectGreen + this.strokeColorNoise);
            this.colorObjectBlue = getRandomFromInterval(this.colorObjectBlue - this.strokeColorNoise, this.colorObjectBlue + this.strokeColorNoise);

            this.strokeColor = color(this.colorObjectRed, this.colorObjectGreen, this.colorObjectBlue);

            this.start = createVector(getRandomFromInterval(0, this.custom_width), getRandomFromInterval(0, this.custom_height));
            this.end = p5.Vector.add(this.start, createVector(getRandomFromInterval(-this.length, this.length), getRandomFromInterval(-this.length, this.length)));

            this.elements.push({
                strokeColor: this.strokeColor,
                strokeWeight: this.strokeWeight,
                // position: createVector(getRandomFromInterval(this.margin, this.custom_width - this.margin), getRandomFromInterval(this.margin, this.custom_height - this.margin))
                start: this.start,
                end: this.end
            })
        }
    }

    show() {

        for (var element of this.elements) {
            push();
            // translate(-width / 2, -height / 2);
            // translate(element.position.x, element.position.y);

            // dirtlines
            stroke(element.strokeColor);
            strokeWeight(element.strokeWeight);
            // line(getRandomFromInterval(0, width), getRandomFromInterval(0, height), getRandomFromInterval(0, width), getRandomFromInterval(0, height));
            line(element.start.x, element.start.y, element.end.x, element.end.y);
            pop();
        }

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