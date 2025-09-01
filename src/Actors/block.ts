import { Actor, CollisionType, Color, DegreeOfFreedom, Engine, Material, Random, Shader, vec, Vector } from "excalibur";
import { rockyMaterial } from "../Shaders/rockMaterial";
import { rockyMaterial2 } from "../Shaders/rockMaterialv2";
import { blockcolliderGroup } from "../collisionGroups";
import { Signal } from "../Lib/Signals";
import { Resources } from "../resources";

export class Block extends Actor {
  material: Material | null = null;
  rockTexture: WebGLTexture | null = null;
  rng: Random;
  maxSpeedX = 45;
  level = 1;
  resetPeriod = 1000;
  restTik = 0;
  clearWarningSignal = new Signal("clearWarning");
  constructor(pos: Vector, seed: number, maxVel = 45, level = 1) {
    let rng = new Random(seed);
    super({
      z: 11,
      pos: pos,
      width: rng.integer(25, 75),
      height: rng.integer(25, 75),
      collisionType: CollisionType.Active,
      color: Color.Transparent,
      collisionGroup: blockcolliderGroup,
    });

    // check width versus position
    if (this.pos.x + this.width / 2 > 145) this.pos.x = 140 - this.width;
    if (this.pos.x - this.width / 2 < -145) this.pos.x = -140 + this.width / 2;

    this.rng = rng;

    this.body.limitDegreeOfFreedom.push(DegreeOfFreedom.Rotation);
    this.body.useGravity = true;
    this.body.bounciness = 0.05;
    this.body.mass = 100;

    this.maxSpeedX = maxVel;

    //set max vel by level
    for (let i = 0; i < level; i++) {
      this.maxSpeedX *= 1.1;
    }
  }

  onInitialize(engine: Engine): void {
    let temprockTexture = this.rng.pickOne(loadRockTextures());
    console.log(temprockTexture);

    this.material = engine.graphicsContext.createMaterial({
      fragmentSource: rockyMaterial2,
      name: "rockyMaterial",
      images: {
        u_rockGraphic: temprockTexture,
      },
    });

    this.graphics.material = this.material;
    const seed = this.rng.next();

    console.log();

    this.material.update((s: Shader) => {
      s.trySetUniformFloat("u_radius", 0.25);
      //s.setUniformFloatColor("u_innercolor", Color.Red);
      s.setUniformFloatColor("u_borderColor", Color.White);
      s.trySetUniformFloat("u_border", 0.05);
      s.trySetUniformFloatVector("u_resolution", vec(this.width, this.height));
      s.trySetUniformFloatColor("u_tintColor", Color.fromHex(`#799324`));
      s.trySetUniformFloat("u_tintStrength", 0.25);
    });

    this.clearWarningSignal.send();
  }

  onPreUpdate(engine: Engine, elapsed: number): void {
    //max vel check
    if (Math.abs(this.vel.y) >= this.maxSpeedX) {
      if (this.vel.y > 0) this.vel.y = this.maxSpeedX;
      if (this.vel.y < 0) this.vel.y = -this.maxSpeedX;
    }

    if (this.body.isSleeping) {
      console.log("sleeping");
    }
  }
}

function randomHexColor(rng: Random) {
  return (
    "#" +
    Math.floor(rng.next() * 0xffffff)
      .toString(16)
      .padStart(6, "0")
  );
}

const loadRockTextures = () => {
  return [
    Resources.rock1,
    Resources.rock2,
    Resources.rock3,
    Resources.rock4,
    Resources.rock5,
    Resources.rock6,
    Resources.rock7,
    Resources.rock8,
    Resources.rock9,
    Resources.rock10,
    Resources.rock11,
    Resources.rock12,
    Resources.rock13,
    Resources.rock14,
  ];
};
