class dirtCircles {

    constructor(data) {
        this.custom_width = data.custom_width;
        this.custom_height = data.custom_height;
        this.margin = data.margin;  // should be relative
        this.pos = createVector(data.posX, data.posY);
        this.fillColor = data.fillColor;
        this.fillColorNoise = data.fillColorNoise;
        // this.strokeColor = data.strokeColor;
        // this.strokeWeight = data.strokeWeight;
        // this.strokeColorNoise = data.strokeColorNoise;
        this.numberQuantisizer = data.numberQuantisizer;
        this.radiusBase = data.radiusBase;
        this.radiusNoise = data.radiusNoise;

        // this.shapeNumber = this.area / width / height * 100 * this.numberQuantisizer;  // relative to size
        // this.shapeNumber = Math.round((this.custom_width * this.custom_height) / (width * height) * 10) * 10 * this.numberQuantisizer;  // relative to size
        this.shapeNumber = Math.round(Math.round(this.custom_width / width * 100) * Math.round(this.custom_height / height * 100)) / 100 * this.numberQuantisizer;  // relative to size
        // console.log(Math.round(this.area / (width * height) * 100));

        this.elements = [];

        for (var i = 0; i < this.shapeNumber; i++) {

            this.elements.push({
                fillColor: distortColorNew(this.fillColor, this.fillColorNoise),
                // strokeColor: distortColorNew(this.strokeColor, this.strokeColorNoise),
                // strokeWeight: this.strokeWeight,
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
            noStroke();
            fill(element.fillColor);
            ellipse(element.pos.x, element.pos.y, getRandomFromInterval(this.radiusBase - this.radiusNoise, this.radiusBase + this.radiusNoise), getRandomFromInterval(this.radiusBase - this.radiusNoise, this.radiusBase + this.radiusNoise));
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