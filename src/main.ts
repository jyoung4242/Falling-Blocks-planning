// main.ts
import "./style.css";

import { UI } from "@peasy-lib/peasy-ui";
import { Engine, DisplayMode, Color, SolverStrategy, PointerEvent, PointerButton, vec, PhysicsConfig, Random } from "excalibur";
import { model, template } from "./UI/UI";
import { loader } from "./resources";
import { Pit } from "./Actors/pit";
import { Block } from "./Actors/block";
import { PitOverlay } from "./Actors/pitoverlay";

await UI.create(document.body, model, template).attached;

let pConfig: PhysicsConfig = {
  solver: SolverStrategy.Realistic,
  gravity: vec(0, 800),
  realistic: { positionIterations: 30, slop: 0.25 },
};

const game = new Engine({
  width: 360, // the width of the canvas
  height: 640, // the height of the canvas
  canvasElementId: "cnv", // the DOM canvas element ID, if you are providing your own
  displayMode: DisplayMode.FitContainer, // the display mode
  pixelArt: true,
  backgroundColor: Color.fromHex("#131617"),
  physics: pConfig,
  fixedUpdateFps: 30,
});

const rng = new Random();

await game.start(loader);
game.add(new Pit());
game.add(new PitOverlay());

game.input.pointers.primary.on("down", (e: PointerEvent) => {
  if (e.button != PointerButton.Left) return;
  let mPos = game.input.pointers.primary.lastWorldPos;
  game.add(new Block(mPos, rng.nextInt()));
});
