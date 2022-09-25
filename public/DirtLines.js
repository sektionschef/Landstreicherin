
class dirtLines {

    constructor(data) {

        if (typeof data === 'undefined') {
            data = {
                custom_width: width,
                custom_height: height,
                posX: 0,
                posY: 0,
                // posX: -width / 2,
                // posY: -height / 2,
                elementSizeMin: 10,
                elementSizeMax: 50,
                colorObject: color(PRIMARYCOLOR),
                margin: 50,
                fillColorNoise: 10,
                fillColorOpacityMax: 10,
                noStroke: true,
                strokeWeight: 10,
                strokeColorNoise: 20,
                strokeOpacityMax: 50,
                numberQuantisizer: 20,
            }
        }


        this.custom_width = data.custom_width;
        this.custom_height = data.custom_height;
        // this.buffer = createGraphics(this.custom_width, this.custom_height);
        this.posX = data.posX;
        this.posY = data.posY;
        this.elementSizeMin = data.elementSizeMin;
        this.elementSizeMax = data.elementSizeMax;
        this.colorObject = data.colorObject;
        this.backgroundColor = data.backgroundColor;
        this.margin = data.margin;
        this.fillColorNoise = data.fillColorNoise;
        this.fillColorOpacityMax = data.fillColorOpacityMax;
        this.noStroke = data.noStroke;
        this.strokeWeight = data.strokeWeight;
        this.strokeColorNoise = data.strokeColorNoise;
        this.strokeOpacityMax = data.strokeOpacityMax;
        this.numberQuantisizer = data.numberQuantisizer;

        // this.strokColorWhitenessMin = 
        this.colorObjectRed = this.colorObject.levels[0];
        this.colorObjectGreen = this.colorObject.levels[1];
        this.colorObjectBlue = this.colorObject.levels[2];

        this.area = this.custom_width * this.custom_height;
        this.shapeNumber = this.area / 1000 * this.numberQuantisizer;  // relative to size

        this.elements = []

        for (var i = 0; i < this.shapeNumber; i++) {
            // easier with hsb?
            let fillColorRed = getRandomFromInterval(this.colorObjectRed - this.fillColorNoise, this.colorObjectRed + this.fillColorNoise);
            let fillColorGreen = getRandomFromInterval(this.colorObjectGreen - this.fillColorNoise, this.colorObjectGreen + this.fillColorNoise);
            let fillColorBlue = getRandomFromInterval(this.colorObjectBlue - this.fillColorNoise, this.colorObjectBlue + this.fillColorNoise);

            // let fillColorOpacity = getRandomFromInterval(this.fillColorOpacityMax / 2, this.fillColorOpacityMax);
            let fillColorOpacity = this.fillColorOpacityMax;
            // let strokeColorOpacity = getRandomFromInterval(this.strokeOpacityMax / 2, this.strokeOpacityMax);
            let strokeColorOpacity = this.strokeOpacityMax;

            let fillColor = color(fillColorRed, fillColorGreen, fillColorBlue, fillColorOpacity);

            // let widthShape = getRandomFromInterval((this.custom_width - this.margin * 2) * 0.05, (this.custom_width - this.margin * 2) * 0.05);  // ca. 50
            // let heightShape = getRandomFromInterval((this.custom_height - this.margin * 2) * 0.05, (this.custom_height - this.margin * 2) * 0.05);  // ca. 50
            let widthShape = getRandomFromInterval(this.elementSizeMin, this.elementSizeMax);
            let heightShape = getRandomFromInterval(this.elementSizeMin, this.elementSizeMax);

            this.elements.push({
                // strokeColor: color(this.colorObjectRed + this.strokeColorNoise, this.colorObjectGreen + this.strokeColorNoise, this.colorObjectBlue + this.strokeColorNoise, strokeColorOpacity),
                strokeColor: color(fillColorRed, fillColorGreen, fillColorBlue, strokeColorOpacity),
                fillColor: fillColor,
                widthShape: widthShape,
                heightShape: heightShape,
                strokeSize: this.strokeWeight,
                posXEl: getRandomFromInterval(this.margin, this.custom_width - this.margin),
                posYEl: getRandomFromInterval(this.margin, this.custom_height - this.margin),
                posXRe: getRandomFromInterval(this.margin, this.custom_width - this.margin),
                posYRe: getRandomFromInterval(this.margin, this.custom_height - this.margin),
            })
        }
    }

    show() {

        for (var element of this.elements) {
            push();
            translate(-width / 2, -height / 2);
            translate((this.posX), (this.posY));

            // dirtlines
            stroke(BACKGROUNDCOLOR + "10");
            strokeWeight(1);
            line(getRandomFromInterval(0, width), getRandomFromInterval(0, height), getRandomFromInterval(0, width), getRandomFromInterval(0, height));
            pop();
        }

        if (MODE >= 5) {
            push();
            noFill();
            strokeWeight(2);
            stroke("#000000");
            // translate((this.posX + this.custom_width / 2) / exportRatio, (this.posY + this.custom_height / 2) / exportRatio);
            // translate((this.posX + this.custom_width / 2), (this.posY + this.custom_height / 2));
            rectMode(CENTER);
            translate(this.custom_width / 2, this.custom_height / 2, 0);
            // translate(this.margin, this.margin, 0);
            // rect(0, 0, this.custom_width / exportRatio, this.custom_height / exportRatio);
            rect(0, 0, this.custom_width - this.margin * 2, this.custom_height - this.margin * 2);
            pop();
        }
    }

}