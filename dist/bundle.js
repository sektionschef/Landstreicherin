window.$fxhashFeatures={"Number of grids":NUMBER_OF_GRIDS},console.info(`fxhash: %c${fxhash}`,"font-weight: bold"),console.log(""),console.group(`Palette: %c${PALETTE_LABEL} `,"font-weight: bold"),console.log("background: %c   ",`background: ${PALETTESYSTEM[PALETTE_LABEL].background}; `),console.log("primaries: %c   ",`background: ${PALETTESYSTEM[PALETTE_LABEL].primaries[0]}; `),console.log("primaries: %c   ",`background: ${PALETTESYSTEM[PALETTE_LABEL].primaries[1]}; `),console.log("hatches: %c   ",`background: ${PALETTESYSTEM[PALETTE_LABEL].hatches[0]}; `),console.log("hatches: %c   ",`background: ${PALETTESYSTEM[PALETTE_LABEL].hatches[1]}; `),console.log("rothkoStroke: %c   ",`background: ${PALETTESYSTEM[PALETTE_LABEL].rothkoStroke}; `),console.log("dirtline: %c   ",`background: ${PALETTESYSTEM[PALETTE_LABEL].dirtline}; `),console.log("dirtCircles: %c   ",`background: ${PALETTESYSTEM[PALETTE_LABEL].dirtCircles}; `),console.groupEnd(),console.log(`Number of grids: %c${NUMBER_OF_GRIDS}`,"font-weight: bold"),console.log(`Brush size: %c${BRUSHSIZEMIN}-${BRUSHSIZEMAX}`,"font-weight: bold"),console.log(`Brush full speed: %c${BRUSHFULLSPEED}`,"font-weight: bold"),console.log(`Brush fibre size: %c${BRUSHFIBRESIZE}`,"font-weight: bold"),console.log(`Brush fibre color noise: %c${BRUSHFIBRECOLORNOISE}`,"font-weight: bold"),console.log(`Brush color distort: %c${BRUSHCOLORDISTORT}`,"font-weight: bold"),console.log(`Distance between lines: %c${DISTANCE_BETWEEN_LINES}`,"font-weight: bold"),console.log(`Rothko stroke opacity: %c${ROTHKOSTROKEOPACITY}`,"font-weight: bold"),console.log(`Brush shape: %c${BRUSHSHAPE}`,"font-weight: bold"),console.log(`Hatch offset: %c${HATCHOFFSET}`,"font-weight: bold"),console.log(`Current pixel density: %c${CURRENTPIXELDENS}`,"font-weight: bold"),console.log(""),FRAMED?setFrameHTML():setPlainHTML();