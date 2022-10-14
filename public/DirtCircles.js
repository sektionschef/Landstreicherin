class dirtCircles {

    constructor(data) {

        this.custom_width = data.custom_width;
        this.custom_height = data.custom_height;
        this.margin = data.margin;
        this.pos = createVector(data.posX, data.posY);
        this.fillColor = data.fillColor;
        this.fillColorNoise = data.fillColorNoise;
        this.strokeColor = data.strokeColor;
        this.strokeWeight = data.strokeWeight;
        this.strokeColorNoise = data.strokeColorNoise;
        this.numberQuantisizer = data.numberQuantisizer;
        this.radiusBase = data.radiusBase;
        this.radiusNoise = data.radiusNoise;

        this.area = this.custom_width * this.custom_height;
        this.shapeNumber = this.area / 1000 * this.numberQuantisizer;  // relative to size

        this.elements = [];

        for (var i = 0; i < this.shapeNumber; i++) {

            this.elements.push({
                fillColor: distortColorNew(this.fillColor, this.fillColorNoise),
                strokeColor: distortColorNew(this.strokeColor, this.strokeColorNoise),
                strokeWeight: this.strokeWeight,
                // position: createVector(getRandomFromInterval(this.margin, this.custom_width - this.margin), getRandomFromInterval(this.margin, this.custom_height - this.margin))
                pos: createVector(getRandomFromInterval((0 + this.margin), (this.custom_width - this.margin)), getRandomFromInterval((0 + this.margin), (this.custom_height - this.margin)))
            })
        }
    }

    show() {

        push();
        translate(this.pos.x, this.pos.y);

        for (var element of this.elements) {
            // stroke(element.strokeColor);
            // strokeWeight(element.strokeWeight);
            fill(this.fillColor);
            noStroke();
            circle(element.pos.x, element.pos.y, getRandomFromInterval(this.radiusBase - this.radiusNoise, this.radiusBase + this.radiusNoise));
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