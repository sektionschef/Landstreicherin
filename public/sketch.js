// const MODE = 1  // "FINE ART";
// const MODE = 2  // DEBUG MESSAGES
const MODE = 5 // all debug messages

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

  // if (urlParams.has('highres')) {
  //   CURRENTPIXELDENS = parseInt(urlParams.get('highres'));
  // }
  // console.log("CURRENTPIXELDENS: " + CURRENTPIXELDENS);

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

  // brush1 = new Brush("x", 150, 350, 200, 200);
  // brush2 = new Brush("x", 150, 350, 175, 175);
  // brush3 = new Brush("x", 150, 350, 225, 225);

  brushXY = new Brush(createVector(300, 450), createVector(460, 600));
  // brush5 = new Brush(createVector(300, 400), createVector(300, 800));

  // grid
  STROKE_SIZE = 1;


  // PADDING_X = getRandomFromInterval(0, 20);
  // PADDING_Y = getRandomFromInterval(0, 20);
  PADDING_X = 0;
  PADDING_Y = 0;

  DISTANCE_BETWEEN_LINES = map(STROKE_SIZE, 1, 5, 10, 25, true);

  // grid = new Grid();
  // grid2 = new Grid();

  // hatches = new Hatches(300, 300, 450, 600, PADDING_X, PADDING_Y, DISTANCE_BETWEEN_LINES);

  sphere = new paintedSphere();
  sphere.show();
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

  if (frameCount == 1) {
    // background(200);
    background(color("#c79712"));
    push()
    translate(-width / 2, -height / 2);
    image(sphere.buffer, 0, 0);
    pop();
  }

  if (MODE == 5) {
    background(200);
  }

  // push();
  // translate(-width / 2, -height / 2);
  // translate(375, 450)
  // box(150, 300, 0);
  // pop();


  // hatches.show();


  // brush1.update();
  // brush1.display();
  // brush2.update();
  // brush2.display();
  // brush3.update();
  // brush3.display();

  brushXY.update();
  brushXY.display();

  // brush5.update();
  // brush5.display();


  // grid.show();
  // grid.show_lines();

  // grid2.show();
  // grid2.show_lines();

  // noLoop();

}

function mousePressed() {
  // console.log("frameCount; " + frameCount);
}
