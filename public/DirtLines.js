
class dirtLines {

    constructor(data) {

        if (typeof data === 'undefined') {
            data = {
                custom_width: width,
                custom_height: height,
                margin: 50,
                posX: 0,
                posY: 0,
                strokeColor: color(200),
                strokeWeight: 0.1,
                strokeColorNoise: 20,
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

        // this.strokColorWhitenessMin = 
        // this.colorObjectRed = this.colorObject.levels[0];
        // this.colorObjectGreen = this.colorObject.levels[1];
        // this.colorObjectBlue = this.colorObject.levels[2];

        this.area = this.custom_width * this.custom_height;
        this.shapeNumber = this.area / 1000 * this.numberQuantisizer;  // relative to size

        this.elements = []

        for (var i = 0; i < this.shapeNumber; i++) {
            // easier with hsb?
            // let fillColorRed = getRandomFromInterval(this.colorObjectRed - this.fillColorNoise, this.colorObjectRed + this.fillColorNoise);
            // let fillColorGreen = getRandomFromInterval(this.colorObjectGreen - this.fillColorNoise, this.colorObjectGreen + this.fillColorNoise);
            // let fillColorBlue = getRandomFromInterval(this.colorObjectBlue - this.fillColorNoise, this.colorObjectBlue + this.fillColorNoise);

            // let fillColor = color(fillColorRed, fillColorGreen, fillColorBlue, fillColorOpacity);

            this.elements.push({
                // strokeColor: color(this.colorObjectRed + this.strokeColorNoise, this.colorObjectGreen + this.strokeColorNoise, this.colorObjectBlue + this.strokeColorNoise, strokeColorOpacity),
                // strokeColor: color(fillColorRed, fillColorGreen, fillColorBlue, strokeColorOpacity),
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