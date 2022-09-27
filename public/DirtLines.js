
class dirtLines {

    constructor(data) {

        if (typeof data === 'undefined') {
            data = {
                custom_width: width,
                custom_height: height,
                margin: 50,
                posX: 0,
                posY: 0,
                strokeColor: color(200, 200, 200),
                strokeWeight: 0.1,
                strokeColorNoise: 0,
                numberQuantisizer: 0.5,
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

            this.elements.push({
                strokeColor: this.strokeColor,
                strokeWeight: this.strokeWeight,
                position: createVector(getRandomFromInterval(this.margin, this.custom_width - this.margin), getRandomFromInterval(this.margin, this.custom_height - this.margin))
            })
        }
    }

    show() {

        for (var element of this.elements) {
            push();
            translate(-width / 2, -height / 2);
            // translate(element.position.x, element.position.y);

            // dirtlines
            stroke(element.strokeColor);
            strokeWeight(element.strokeWeight);
            line(getRandomFromInterval(0, width), getRandomFromInterval(0, height), getRandomFromInterval(0, width), getRandomFromInterval(0, height));
            line(0, 0, 400, 500);
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