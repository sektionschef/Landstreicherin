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

let BRUSHCOLOR = "#8f6900";
let PRIMARYCOLOR = "#f7c331";
let BACKGROUNDCOLOR = "#8f6900";

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
  "Arielle": [
    "#534438",
    "#FBE1BB",
    "#785237",
    "#926139",
  ],
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
  // console.log(PALETTE_LABEL);
  PALETTE = PALETTESYSTEM[PALETTE_LABEL];
}

function createPaletteColors() {

  for (let palette in PALETTESYSTEM) {
    // console.log(palette)
    for (var i = 0; i < PALETTESYSTEM[palette].length; i++) {
      // console.log(PALETTESYSTEM[palette][i])
      PALETTESYSTEM[palette][i] = color(PALETTESYSTEM[palette][i]);
    }
  }
}

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
  noiseSeed(NOISESEED);
  randomSeed(NOISESEED);

  // setAttributes('antialias', true);

  scaleDynamically();

  canvas = createCanvas(rescaling_width, rescaling_height, WEBGL);
  canvas.id('badAssCanvas');

  if (MODE > 1) {
    console.log("Display density: " + displayDensity());
    // console.log("Pixel density: " + pixelDensity())
  }

  createPaletteColors();

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

  // hatchesHigh = new Hatches("yx", createVector(100, 300), createVector(250, 600), PADDING_X, PADDING_Y, DISTANCE_BETWEEN_LINES);
  // hatchesLong = new Hatches("yx", createVector(300, 300), createVector(650, 400), PADDING_X, PADDING_Y, DISTANCE_BETWEEN_LINES);
  // hatchesHigh = new Hatches("yx", createVector(100, 100), createVector(450, 900), PADDING_X, PADDING_Y, DISTANCE_BETWEEN_LINES);
  // hatchesLong = new Hatches("yx", createVector(100, 100), createVector(750, 300), PADDING_X, PADDING_Y, DISTANCE_BETWEEN_LINES);

  // hatchesBug = new Hatches("y", createVector(717, 50), createVector(898, 898), PADDING_X, PADDING_Y, DISTANCE_BETWEEN_LINES);

  grid = new Grid();
  grid2 = new Grid();
  grid3 = new Grid();


  // background(200);
  background(color(BACKGROUNDCOLOR));

  // basic fill for transparency
  // push()
  // fill(BACKGROUNDCOLOR);
  // noStroke();
  // translate(-width / 2, -height / 2);
  // rect(0, 0, width, height);
  // pop()



  sphere = new paintedSphere({
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
    fillColorNoise: 35,
    fillColorOpacityMax: 15,
    noStroke: true,
    strokeWeight: 10,
    strokeColorNoise: 20,
    strokeOpacityMax: 20,
    numberQuantisizer: 40,
  });
  sphere.show();

  dirtLines = new dirtLines();

  // background(200);
  background(color(BACKGROUNDCOLOR));
  push()
  translate(-width / 2, -height / 2);
  image(sphere.buffer, 0, 0);
  pop();


  // brush color
  // push();
  // strokeWeight(0.3);
  // for (var i = 0; i <= 30; i++) {
  //   stroke(getRandomFromInterval(50, 150));
  //   line(getRandomFromInterval(-5, 5), getRandomFromInterval(-5, 5), getRandomFromInterval(-5, 5), getRandomFromInterval(-5, 5));
  // }
  // pop();

}


function draw() {

  pixelDensity(CURRENTPIXELDENS);

  // camera(0, 0, (height / 2) / tan(PI / 6), 0, 0, 0, 0, 1, 0);  // default
  // if (MODE == 5) {
  //   camera(0, 800, 0, 0, 0, 0, 0, 0, 1); // debug - on top view
  //   // camera(-1500, 0, 0, 0, 0, 0, 0, -1, 0); // debug -- side view
  // } else {
  //   camera(0, 700, 0, 0, 0, 0, 0, 0, 1);
  // }

  ambientLight(255, 255, 255);
  // directionalLight(200, 200, 200, 1, -1, 0);
  // pointLight(155, 155, 155, 20 * conv, 0 * conv, -30 * conv)
  // ambientMaterial(255);
  // specularMaterial(255);


  if (MODE == 5) {
    background(200);
  }

  // push();
  // translate(-width / 2, -height / 2);
  // translate(375, 450)
  // box(150, 300, 0);
  // pop();


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
  grid2.show();
  grid3.show();

  // noLoop();

  if (grid.boxes_completely_run && grid2.boxes_completely_run) {
    dirtLines.show();
    console.log("All done");
    noLoop();
  }

}

function mousePressed() {
  // console.log("frameCount; " + frameCount);
}
