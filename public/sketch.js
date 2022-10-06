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
let HATCHSIZEMIN = 0.5;
let HATCHSIZEMAX = 1.5;
console.log("HATCHSIZEMIN: " + HATCHSIZEMIN + " " + "HATCHSIZEMAX: " + HATCHSIZEMAX);


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
  "Suzy": {
    "background": "#e67171",
    "primaries": [
      "#eb4a00ff",
      "#929ba1ff",
    ],
    "hatches": [
      "#c25725ff",
      "#87888aff",
    ]
  },
  // "Golden BU": {
  //   "background": "#856100",
  //   "primaries": [
  //     "#86a8bb",
  //     "#f7c331",
  //   ],
  //   "hatches": [
  //     "#7996a5",
  //     "#d1a836",
  //   ]
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

  // grid
  STROKE_SIZE = 1;

  // PADDING_X = getRandomFromInterval(0, 20);
  // PADDING_Y = getRandomFromInterval(0, 20);
  PADDING_X = 0;
  PADDING_Y = 0;

  DISTANCE_BETWEEN_LINES = map(STROKE_SIZE, 1, 5, 10, 25, true);

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

  dirtLines = new dirtLines();


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
    dirtLines.show();
    console.log("All done");
    noLoop();
  }

}

function mousePressed() {
  // console.log("frameCount; " + frameCount);
}
