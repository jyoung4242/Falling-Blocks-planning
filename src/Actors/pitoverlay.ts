import { Actor, Color, Engine, Material, Shader, vec, Vector } from "excalibur";
import { waterfill } from "../Shaders/waterfill";
import { Signal } from "../Lib/Signals";

export class PitOverlay extends Actor {
  material: Material | null = null;

  fillSignal = new Signal("fill");
  fillLevelSignal = new Signal("fillLevel");
  isFilling = false;

  fillAmount = 0;
  waterColor = Color.fromHex("#7b943bff");
  waterOpacity = 0.75;

  fillTime = 3000;
  fillTimeLimit = 100000;

  messagerate: number = 500;
  messageTik: number = 0;

  constructor() {
    super({
      z: 10,
      pos: vec(0, 0),
      width: 320,
      height: 640,
      anchor: Vector.Half,
      color: Color.Transparent,
    });

    this.fillSignal.listen((e: CustomEvent) => {
      let params = e.detail.params;
      this.isFilling = params[0];
      if (params[0]) this.fillTimeLimit = params[1];
      this.fillAmount = 0;
      this.fillTime = 3000;
    });
  }

  onInitialize(engine: Engine): void {
    this.material = engine.graphicsContext.createMaterial({
      name: "waterfill",
      fragmentSource: waterfill,
    });
    engine.currentScene.camera.strategy.lockToActor(this);
    this.graphics.material = this.material;
  }

  changeColor(color: Color) {
    this.waterColor = color;
  }

  onPreUpdate(engine: Engine, elapsed: number): void {
    if (this.isFilling) {
      this.fillTime += elapsed;

      this.messageTik += elapsed;
      if (this.messageTik > this.messagerate) {
        this.messageTik = 0;
        this.fillLevelSignal.send([this.fillTime / this.fillTimeLimit]);
      }
    }
    this.fillAmount = this.fillTime / this.fillTimeLimit;
    this.material?.update((s: Shader) => {
      s.trySetUniformFloat("u_fillAmount", this.fillAmount);
      s.trySetUniformFloatColor("u_waterColor", this.waterColor);
      s.trySetUniformFloat("u_waterOpacity", this.waterOpacity);
      s.setUniformFloat("u_waveAmplitude", 0.005);
      s.trySetUniformFloat("u_waveFrequency", 30.0);
      s.trySetUniformFloat("u_waveSpeed", 4.0);
      s.trySetUniformFloat("u_noiseAmplitude", 0.005); // subtle noise
    });
  }
}
