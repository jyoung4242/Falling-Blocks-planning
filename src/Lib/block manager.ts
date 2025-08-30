import { Engine, Random, Scene, vec } from "excalibur";
import { Block } from "../Actors/block";

export class BlockManager {
  rng: Random;
  triggerLimit = 2500;
  triggerTik = 0;
  isActive = false;
  engine: Engine;
  scene: Scene | null = null;

  constructor(engine: Engine) {
    this.engine = engine;
    this.rng = new Random();
  }

  update(elapsed: number) {
    if (this.isActive) {
      this.triggerTik += elapsed;
      if (this.triggerTik > this.triggerLimit) {
        this.triggerTik = 0;
        this.dropBlock();
      }
    }
  }

  dropBlock() {
    //pick random x
    if (!this.scene) return;

    let pos = vec(this.rng.integer(-140, 140), -400);
    let seed = this.rng.nextInt();
    this.scene.add(new Block(pos, seed));
  }

  bumpLevel() {
    this.triggerLimit *= 0.9;
    this.triggerTik = 0;
  }

  regScene(scene: Scene) {
    this.scene = scene;
  }

  set active(v: boolean) {
    this.isActive = v;
  }

  get active() {
    return this.isActive;
  }
}
