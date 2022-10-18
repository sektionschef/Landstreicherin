const MODE = 1  // "FINE ART";
// const MODE = 2  // DEBUG MESSAGES
// const MODE = 5 // all debug messages

const NOISESEED = hashFnv32a(fxhash);
if (MODE > 1) {
  console.log("Noise seed: " + NOISESEED);
}

let canvas;
let rescaling_width;
let rescaling_height;

let PALETTE;
let PALETTE_LABEL;
let ALLDONE = false;
let DOMINANTSIDE;

// FEATURES
let NUMBER_OF_GRIDS = getRandomFromList([1, 2, 3]);
console.log("NUMBER_OF_GRIDS: " + NUMBER_OF_GRIDS);
let BRUSHSIZEMIN = 0.5;
let BRUSHSIZEMAX = 1.5;
console.log("BRUSHSIZEMIN: " + BRUSHSIZEMIN + " " + "BRUSHSIZEMAX: " + BRUSHSIZEMAX);
let BRUSHFULLSPEEDMIN = 2;
let BRUSHFULLSPEEDMAX = 6;
let BRUSHFULLSPEED = getRandomFromInterval(BRUSHFULLSPEEDMIN, BRUSHFULLSPEEDMAX);
let BRUSHFIBRESIZE = getRandomFromInterval(0.2, 0.4); // 0.4;
console.log("BRUSHFIBRESIZE: " + BRUSHFIBRESIZE);
let BRUSHFIBRECOLORNOISE = getRandomFromInterval(3, 10);
console.log("BRUSHFIBRECOLORNOISE: " + BRUSHFIBRECOLORNOISE);
let BRUSHCOLORDISTORT = getRandomFromInterval(5, 10);
console.log("BRUSHCOLORDISTORT: " + BRUSHCOLORDISTORT);
// let DISTANCE_BETWEEN_LINES = map(BRUSHFULLSPEEDMAX, 1, 5, 10, 25, true);

let DISTANCE_BETWEEN_LINES_MULTIPLIER = getRandomFromInterval(6, 16);
let DISTANCE_BETWEEN_LINES = BRUSHSIZEMAX * DISTANCE_BETWEEN_LINES_MULTIPLIER;
console.log("DISTANCE_BETWEEN_LINES: " + DISTANCE_BETWEEN_LINES);

ROTHKOSTROKEOPACITY = getRandomFromInterval(5, 30);
console.log("ROTHKOSTROKEOPACITY: " + ROTHKOSTROKEOPACITY);

BRUSHSHAPE = getRandomFromList(["Line", "Ellipse", "Triangle"]);
console.log("BRUSHSHAPE: " + BRUSHSHAPE);

let CURRENTPIXELDENS = 1;

let PaperDimensions = {
  "Quickie": {
    width: 800,
    height: 800
  },
  "Stammersdorf": {
    width: 3840,
    height: 2160
  },
  "1to1": {
    width: 4000,
    height: 4000
  },
}

const PALETTESYSTEM = {
  "Dead": {
    "background": "#32746D",
    "primaries": [
      "#9EC5AB",
      "#104F55",
    ],
    "hatches": [
      "#88ac94",
      "#14545a",
    ],
    "rothkoStroke": "#1b1818",
    "dirtline": "#404040",
    "dirtCircles": "#32746D",
  },
  "Feinstaub": {
    "background": "#b1b1b1",
    "primaries": [
      "#ff993a",
      "#F52F57",
    ],
    "hatches": [
      "#cf6426",
      "#ec4163",
    ],
    "rothkoStroke": "#1b1818",
    "dirtline": "#404040",
    "dirtCircles": "#747474",
  },
  "Horsti": {
    "background": "#7ca3bb",
    "primaries": [
      "#669BBC",
      "#F3A712",
    ],
    "hatches": [
      "#669BBC",
      "#F3A712",
    ],
    "rothkoStroke": "#1b1818",
    "dirtline": "#404040",
    "dirtCircles": "#7ca3bb",
  },
  "Suzy": {
    "background": "#7c452cff",
    "primaries": [
      "#eb4a00ff",
      "#3378a3ff",
    ],
    "hatches": [
      "#c45927ff",
      "#224f6bff",
    ],
    "rothkoStroke": "#1b1818",
    "dirtline": "#404040",
    "dirtCircles": "#7c452cff",
  },
  "Golden BU": {
    "background": "#c7c6c5",
    "primaries": [
      "#86a8bb",
      "#f7c331",
    ],
    "hatches": [
      "#4ea1c7",
      "#dbb345",
    ],
    "rothkoStroke": "#1b1818",
    "dirtline": "#616161",
    "dirtCircles": "#818181ff",
  },
  "Aneignung": {
    "background": "#612541",
    "primaries": [
      "#c2798e",
      "#a3234a",
    ],
    "hatches": [
      "#c2798e",
      "#a3234a",
    ],
    "rothkoStroke": "#1b1818",
    "dirtline": "#404040",
    "dirtCircles": "#7a3656",
  },
  "MoltoVolto": {
    "background": "#cccdcd",
    "primaries": [
      "#78a5a5",
      "#776161",
    ],
    "hatches": [
      "#709797",
      "#6d5c5c",
    ],
    "rothkoStroke": "#1b1818",
    "dirtline": "#3d3b3b",
    "dirtCircles": "#797979",
  },
  "Molto": {
    "background": "#323a3a",
    "primaries": [
      "#20cccc",
      "#be2020",
    ],
    "hatches": [
      "#337c8f",
      "#a70c0c",
    ],
    "rothkoStroke": "#1b1818",
    "dirtline": "#3d3b3b",
    "dirtCircles": "#666666",
  },
  "Das Zeitliche": {
    "background": "#2d3131",
    "primaries": [
      "#504242",
      "#687980",
    ],
    "hatches": [
      "#3d3d3dff",
      "#556266ff",
    ],
    "rothkoStroke": "#1b1818",
    "dirtline": "#757474",
    "dirtCircles": "#666666",
  },
  "Frischkäse": {
    "background": "#333338",
    "primaries": [
      "#d6a076",
      "#6e6f85",
    ],
    "hatches": [
      "#b18563",
      "#363968",
    ],
    "rothkoStroke": "#3b3939",
    "dirtline": "#757474",
    "dirtCircles": "#666666",
  },
}

choosePalette()

function choosePalette() {

  allPalettes = [];
  for (let palette in PALETTESYSTEM) {
    // console.log(palette)
    allPalettes.push(palette)
  }
  // console.log(allPalettes);
  PALETTE_LABEL = getRandomFromList(allPalettes);
  console.log("Palette: " + PALETTE_LABEL);
  PALETTE = PALETTESYSTEM[PALETTE_LABEL];
}

function preload() {
  font = loadFont('OpenSans-Regular.ttf');

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  if (urlParams.has('highres')) {
    CURRENTPIXELDENS = parseInt(urlParams.get('highres'));
  }
  console.log("CURRENTPIXELDENS: " + CURRENTPIXELDENS);

  // if (urlParams.has('infinity')) {
  //   INFINITYSTRING = urlParams.get('infinity');
  //   INFINITY = (INFINITYSTRING === 'true');
  // }
  // console.log("INFINITY: " + INFINITY);
}

function setup() {

  setAttributes('alpha', true);

  noiseSeed(NOISESEED);
  randomSeed(NOISESEED);

  // setAttributes('antialias', true);

  scaleDynamically();

  // canvas = createCanvas(rescaling_width, rescaling_height, WEBGL);
  canvas = createCanvas(rescaling_width, rescaling_height);
  canvas.id('badAssCanvas');

  if (MODE > 1) {
    console.log("Display density: " + displayDensity());
    // console.log("Pixel density: " + pixelDensity())
  }

  // EXAMPLES for DEV
  // brushX = new Brush(createVector(150, 200), createVector(350, 200));
  // brushXY = new Brush(createVector(400, 450), createVector(560, 600));
  // brushY = new Brush(createVector(300, 400), createVector(300, 800));
  // brushYX = new Brush(createVector(400, 600), createVector(560, 450));

  // brushBug = new Brush(createVector(807, 50), createVector(807, 898));

  // hatchesHigh = new Hatches("yx", createVector(100, 300), createVector(250, 600), color(30), 0, 0, DISTANCE_BETWEEN_LINES);
  // hatchesLong = new Hatches("yx", createVector(300, 300), createVector(650, 400), color(30), 0, 0, DISTANCE_BETWEEN_LINES);
  // hatchesHigh = new Hatches("yx", createVector(100, 100), createVector(450, 900), color(30), 0, 0, DISTANCE_BETWEEN_LINES);
  // hatchesLong = new Hatches("yx", createVector(100, 100), createVector(750, 300), color(30), 0, 0, DISTANCE_BETWEEN_LINES);

  // hatchesBug = new Hatches("y", createVector(717, 50), createVector(898, 898), color(30), 0, 0, DISTANCE_BETWEEN_LINES);

  backgroundDirtCircles = new dirtCircles(
    {
      custom_width: width,
      custom_height: height,
      margin: 0,
      posX: 0,
      posY: 0,
      fillColor: color(PALETTE.background),
      fillColorNoise: 10,
      numberQuantisizer: 2000,
      radiusBase: 0.75,
      radiusNoise: 0.25,
    }
  );


  corroded = new Corroded(
    {
      custom_width: width,
      custom_height: height,
      posX: 0,
      posY: 0,
      fillColor: color(PALETTE.background),
    }
  );

  grid = new Grid();
  if (NUMBER_OF_GRIDS >= 2) {
    grid2 = new Grid();
  }
  if (NUMBER_OF_GRIDS >= 3) {
    grid3 = new Grid();
  }

}


function draw() {

  // pixelDensity(CURRENTPIXELDENS);

  // camera(0, 0, (height / 2) / tan(PI / 6), 0, 0, 0, 0, 1, 0);  // default
  // if (MODE == 5) {
  //   camera(0, 800, 0, 0, 0, 0, 0, 0, 1); // debug - on top view
  //   // camera(-1500, 0, 0, 0, 0, 0, 0, -1, 0); // debug -- side view
  // } else {
  //   camera(0, 700, 0, 0, 0, 0, 0, 0, 1);
  // }

  // ambientLight(255, 255, 255);
  // directionalLight(200, 200, 200, 1, -1, 0);
  // pointLight(155, 155, 155, 20 * conv, 0 * conv, -30 * conv)
  // ambientMaterial(255);
  // specularMaterial(255);


  if (frameCount == 1) {
    pixelDensity(CURRENTPIXELDENS);
    // background(distortColorNew(PALETTE[0], 30));
    background(color(PALETTE.background));
    corroded.show();
    backgroundDirtCircles.show();
  }


  if (MODE == 5) {
    background(200);
  }

  // hatchesHigh.show();
  // hatchesLong.show();

  // hatchesBug.show();


  // brush examples
  // brushX.update();
  // brushX.display();
  // brushXY.update();
  // brushXY.display();
  // brushY.update();
  // brushY.display();
  // brushYX.update();
  // brushYX.display();

  // brushBug.update();
  // brushBug.display();

  grid.show();
  if (NUMBER_OF_GRIDS >= 2) {
    grid2.show();
  }
  if (NUMBER_OF_GRIDS >= 3) {
    grid3.show();
  }


  if (NUMBER_OF_GRIDS == 1 && grid.boxes_completely_run) {
    ALLDONE = true;
  }
  if (NUMBER_OF_GRIDS == 2 && grid.boxes_completely_run && grid2.boxes_completely_run) {
    ALLDONE = true;
  }
  if (NUMBER_OF_GRIDS == 3 && grid.boxes_completely_run && grid2.boxes_completely_run && grid3.boxes_completely_run) {
    ALLDONE = true;
  }

  if (ALLDONE == true) {
    // dirtCircles.show();
    console.log("All done");
    noLoop();
    fxpreview();
  }

}

function mousePressed() {
  // console.log("frameCount; " + frameCount);
}
