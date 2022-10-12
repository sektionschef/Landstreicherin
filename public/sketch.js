const MODE = 1  // "FINE ART";
// const MODE = 2  // DEBUG MESSAGES
// const MODE = 5 // all debug messages

const NOISESEED = hashFnv32a(fxhash);
if (MODE > 1) {
  console.log("Noise seed: " + NOISESEED);
}

// convert pixel to real world physics
const conv = 10;

let canvas;
let rescaling_width;
let rescaling_height;

let PALETTE;
let PALETTE_LABEL;
let ALLDONE = false;

// let BRUSHCOLOR = "#8f6900";
// let PRIMARYCOLOR = "#f7c331";
// let BACKGROUNDCOLOR = "#8f6900";

// Living Coral (#FC766AFF) and Pacific Coast (#5B84B1FF)
// let BRUSHCOLOR = "#FC766AFF";
// let PRIMARYCOLOR = "#5B84B1FF";
// let BACKGROUNDCOLOR = "#FC766AFF";

// FEATURES
let NUMBER_OF_GRIDS = getRandomFromList([1, 2, 3]);
console.log("NUMBER_OF_GRIDS: " + NUMBER_OF_GRIDS);
let BRUSHSIZEMIN = 0.5;
let BRUSHSIZEMAX = 1.5;
console.log("BRUSHSIZEMIN: " + BRUSHSIZEMIN + " " + "BRUSHSIZEMAX: " + BRUSHSIZEMAX);
let BRUSHFULLSPEEDMIN = 2;
let BRUSHFULLSPEEDMAX = 5;
let BRUSHFULLSPEED = getRandomFromInterval(BRUSHFULLSPEEDMIN, BRUSHFULLSPEEDMAX);
let BRUSHFIBRESIZE = getRandomFromInterval(0.2, 0.4); // 0.4;
console.log("BRUSHFIBRESIZE: " + BRUSHFIBRESIZE);
let BRUSHFIBRECOLORNOISE = getRandomFromInterval(3, 10);
console.log("BRUSHFIBRECOLORNOISE: " + BRUSHFIBRECOLORNOISE);
let BRUSHCOLORDISTORT = getRandomFromInterval(5, 10);
console.log("BRUSHCOLORDISTORT: " + BRUSHCOLORDISTORT);
// let DISTANCE_BETWEEN_LINES = map(BRUSHFULLSPEEDMAX, 1, 5, 10, 25, true);

let DISTANCE_BETWEEN_LINES_MULTIPLIER = getRandomFromInterval(2, 4);
let DISTANCE_BETWEEN_LINES = BRUSHFULLSPEEDMAX * DISTANCE_BETWEEN_LINES_MULTIPLIER;

ROTHKOSTROKEOPACITY = getRandomFromInterval(5, 30);
console.log("ROTHKOSTROKEOPACITY: " + ROTHKOSTROKEOPACITY);

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
  // "Suzy": {
  //   "background": "#7c452cff",
  //   "primaries": [
  //     "#eb4a00ff",
  //     "#3378a3ff",
  //   ],
  //   "hatches": [
  //     "#c45927ff",
  //     "#224f6bff",
  //   ],
  //   "dirtline": "#404040",
  // },
  // "Golden BU": {
  //   "background": "#856100",
  //   "primaries": [
  //     "#86a8bb",
  //     "#f7c331",
  //   ],
  //   "hatches": [
  //     "#597886",
  //     "#e0b12e",
  //   ],
  //   "dirtline": "#404040",
  // },
  // "Aneignung": {
  //   "background": "#71294b",
  //   "primaries": [
  //     "#c2798e",
  //     "#a3234a",
  //   ],
  //   "hatches": [
  //     "#c2798e",
  //     "#a3234a",
  //   ],
  //   "dirtline": "#404040",
  // },
  "Molto": {
    // "background": "#cccdcd",
    "background": "#323a3a",
    "primaries": [
      // "#a2a7a7",
      // "#736767",
      "#20cccc",
      "#be2020",
    ],
    "hatches": [
      "#406068",
      "#722929",
    ],
    "rothkoStroke": "#1b1818",
    "dirtline": "#3d3b3b",
  },
  // "Das Zeitliche": {
  //   "background": "#2d3131",
  //   "primaries": [
  //     "#443f3f",
  //     "#788185",
  //   ],
  //   "hatches": [
  //     "#797e7eff",
  //     "#4c5457ff",
  //   ],
  //   "rothkoStroke": "#1b1818",
  //   "dirtline": "#757474",
  // },
  // "Frischkäse": {
  //   "background": "#333338",
  //   "primaries": [
  //     "#d6a076",
  //     "#6e6f85",
  //   ],
  //   "hatches": [
  //     "#d6a076",
  //     "#363968",
  //   ],
  //   "rothkoStroke": "#3b3939",
  //   "dirtline": "#757474",
  // },
}

// grid
let SCALING_FACTOR = 1;

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

// convert strings to colors
// function createPaletteColors() {

//   for (let palette in PALETTESYSTEM) {
//     // console.log(palette)
//     for (var i = 0; i < PALETTESYSTEM[palette].length; i++) {
//       // console.log(PALETTESYSTEM[palette][i])
//       PALETTESYSTEM[palette][i] = color(PALETTESYSTEM[palette][i]);
//     }
//   }
// }

function preload() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  font = loadFont('OpenSans-Regular.ttf');

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

  // createPaletteColors();

  // brushX = new Brush(createVector(150, 200), createVector(350, 200));
  // brushXY = new Brush(createVector(400, 450), createVector(560, 600));
  // brushY = new Brush(createVector(300, 400), createVector(300, 800));
  // brushYX = new Brush(createVector(400, 600), createVector(560, 450));

  // brushBug = new Brush(createVector(807, 50), createVector(807, 898));

  // PADDING_X = getRandomFromInterval(0, 20);
  // PADDING_Y = getRandomFromInterval(0, 20);
  PADDING_X = 0;
  PADDING_Y = 0;

  // hatchesHigh = new Hatches("yx", createVector(100, 300), createVector(250, 600), color(30), PADDING_X, PADDING_Y, DISTANCE_BETWEEN_LINES);
  // hatchesLong = new Hatches("yx", createVector(300, 300), createVector(650, 400), color(30), PADDING_X, PADDING_Y, DISTANCE_BETWEEN_LINES);
  // hatchesHigh = new Hatches("yx", createVector(100, 100), createVector(450, 900), color(30), PADDING_X, PADDING_Y, DISTANCE_BETWEEN_LINES);
  // hatchesLong = new Hatches("yx", createVector(100, 100), createVector(750, 300), color(30), PADDING_X, PADDING_Y, DISTANCE_BETWEEN_LINES);

  // hatchesBug = new Hatches("y", createVector(717, 50), createVector(898, 898), color(30), PADDING_X, PADDING_Y, DISTANCE_BETWEEN_LINES);

  grid = new Grid();
  if (NUMBER_OF_GRIDS >= 2) {
    grid2 = new Grid();
  }
  if (NUMBER_OF_GRIDS >= 3) {
    grid3 = new Grid();
  }

  sphere = new RothkoRect({
    custom_width: width,
    custom_height: height,
    posX: 0,
    posY: 0,
    elementSizeMin: 10,
    elementSizeMax: 50,
    margin: 50,
    fillColor: color(PALETTE.primaries[0]),
    fillColorNoise: 7,
    fillColorOpacity: 10,
    noStroke: false,
    strokeColor: color(50),
    strokeWeight: 1,
    strokeColorNoise: 3,
    strokeOpacity: 6,
    numberQuantisizer: 10,
  });

  // dirtLines = new dirtLines(
  //   data = {
  //     custom_width: width,
  //     custom_height: height,
  //     margin: 50,
  //     posX: 0,
  //     posY: 0,
  //     strokeColor: color(PALETTE.dirtline),
  //     strokeWeight: 0.1,
  //     strokeColorNoise: 0,
  //     numberQuantisizer: 15,  // 3
  //     length: 40,  // 80
  //   }
  // );


  rothko = new RothkoRect({
    custom_width: 500,
    custom_height: 300,
    posX: 100,
    posY: 300,
    elementSizeMin: 10,
    elementSizeMax: 50,
    margin: 0,
    fillColor: color(PALETTE.primaries[1]),
    fillColorNoise: 3,
    fillColorOpacity: 10,
    noStroke: false,
    strokeColor: color(50),
    strokeWeight: 1,
    strokeColorNoise: 3,
    strokeOpacity: 15,
    numberQuantisizer: 10,
  });

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
    // sphere.show();
    // rothko.show();
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



  // noLoop();


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
    // rothko.show();
    // dirtLines.show();
    console.log("All done");
    noLoop();
  }

}

function mousePressed() {
  // console.log("frameCount; " + frameCount);
}
