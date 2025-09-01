import { Engine, Random, Scene, vec } from "excalibur";
import { Block } from "../Actors/block";
import { Signal } from "./Signals";
import { DropWarning } from "../Actors/warning";

export class BlockManager {
  exitMetSignal = new Signal("exitMet");
  startNextRoundSignal = new Signal("startNextRound");
  clearWarningSignal = new Signal("clearWarning");
  fillSignal = new Signal("fill");
  rng: Random;
  warneringLimit = 2000;
  triggerLimit = 2500;
  triggerTik = 0;
  isActive = false;
  engine: Engine;
  scene: Scene | null = null;
  maxVel = 45;
  nextBlock: Block | null = null;
  dropWarning: DropWarning | null = null;

  fillTik = 0;
  fillDelay = 12500;
  fillTimeLimit = 150000;
  isFilling = false;

  constructor(engine: Engine) {
    this.engine = engine;
    this.rng = new Random();

    this.exitMetSignal.listen(() => {
      // round over, stop dropping blocks
      this.isActive = false;
      this.fillTik = 0;
      // clear up all blocks from scene
      const blocks = this.scene?.entities.filter(e => e instanceof Block);
      blocks?.forEach(b => b.kill());
    });

    this.clearWarningSignal.listen(() => {
      this.dropWarning = null;
    });

    this.startNextRoundSignal.listen(() => {
      console.log("start next round");
      this.bumpLevel();
      this.isActive = true;
    });

    let pos = vec(this.rng.integer(-140, 140), -400);
    let seed = this.rng.nextInt();
    this.nextBlock = new Block(pos, seed, this.maxVel);
  }

  update(elapsed: number) {
    if (this.isActive) {
      this.triggerTik += elapsed;
      this.fillTik += elapsed;

      if (this.fillTik > this.fillDelay && !this.isFilling) {
        this.fillTik = 0;
        this.fillSignal.send([true, this.fillTimeLimit]);
        this.isFilling = true;
      }

      if (this.triggerTik > this.warneringLimit && this.dropWarning == null) {
        //show warning
        this.dropWarning = new DropWarning(this.nextBlock!.pos, this.nextBlock!.width);
        this.scene?.add(this.dropWarning);
      }

      if (this.triggerTik > this.triggerLimit) {
        this.dropBlock(this.nextBlock as Block);
        this.triggerTik = 0;
        let pos = vec(this.rng.integer(-140, 140), -400);
        let seed = this.rng.nextInt();
        this.nextBlock = new Block(pos, seed, this.maxVel);
      }
    }
  }

  dropBlock(Block: Block) {
    //pick random x
    if (!this.scene) return;

    this.scene.add(Block);
  }

  bumpLevel() {
    this.triggerLimit *= 0.9;
    this.warneringLimit *= 0.9;
    this.triggerTik = 0;
    this.maxVel *= 1.1;
    this.fillTimeLimit *= 0.9;
    this.isFilling = false;
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
