class RothkoRect{constructor(t){this.custom_width=t.custom_width,this.custom_height=t.custom_height,this.posX=t.posX,this.posY=t.posY,this.elementSizeMin=t.elementSizeMin,this.elementSizeMax=t.elementSizeMax,this.margin=t.margin,this.fillColor=t.fillColor,this.fillColorNoise=t.fillColorNoise,this.fillColorOpacity=t.fillColorOpacity,this.noStroke=t.noStroke,this.strokeColor=t.strokeColor,this.strokeWeight=t.strokeWeight,this.strokeColorNoise=t.strokeColorNoise,this.strokeOpacity=t.strokeOpacity,this.numberQuantisizer=t.numberQuantisizer,this.area=Math.round(Math.round(this.custom_width/DOMINANTSIDE*100)*Math.round(this.custom_height/DOMINANTSIDE*100))/100,this.shapeNumber=Math.round(10*this.area*this.numberQuantisizer),this.elements=[],this.fillColor=color(red(this.fillColor),green(this.fillColor),blue(this.fillColor),this.fillColorOpacity),this.strokeColor=color(red(this.strokeColor),green(this.strokeColor),blue(this.strokeColor),this.strokeOpacity);for(var o=0;o<this.shapeNumber;o++){let t=getRandomFromInterval(this.elementSizeMin,this.elementSizeMax),o=getRandomFromInterval(this.elementSizeMin,this.elementSizeMax);this.elements.push({strokeColor:this.strokeColor,fillColor:distortColorNew(this.fillColor,this.fillColorNoise),widthShape:t,heightShape:o,strokeSize:this.strokeWeight,strokeColor:distortColorNew(this.strokeColor,this.strokeColorNoise),posXEl:getRandomFromInterval(this.margin,this.custom_width-this.margin),posYEl:getRandomFromInterval(this.margin,this.custom_height-this.margin),posXRe:getRandomFromInterval(this.margin,this.custom_width-this.margin),posYRe:getRandomFromInterval(this.margin,this.custom_height-this.margin)})}}show(){for(var t of this.elements)push(),fill(t.fillColor),rectMode(CENTER),ellipseMode(CENTER),translate(this.posX,this.posY),1==this.noStroke?noStroke():(strokeWeight(strokeWeight),stroke(t.strokeColor)),ellipse(t.posXEl,t.posYEl,t.widthShape,t.heightShape),rect(t.posXRe,t.posYRe,t.widthShape,t.heightShape),pop();MODE>=5&&(push(),noFill(),strokeWeight(2),stroke("#000000"),rectMode(CENTER),translate(this.custom_width/2,this.custom_height/2,0),rect(0,0,this.custom_width-2*this.margin,this.custom_height-2*this.margin),pop())}}