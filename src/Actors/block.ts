import { Actor, CollisionType, Color, DegreeOfFreedom, Engine, Material, Random, Shader, vec, Vector } from "excalibur";
import { rockyMaterial } from "../Shaders/rockMaterial";
import { blockcolliderGroup } from "../collisionGroups";

export class Block extends Actor {
  material: Material | null = null;
  rng: Random;
  maxSpeedX = 45;
  level = 1;
  constructor(pos: Vector, seed: number, level: number = 1) {
    let rng = new Random(seed);
    super({
      z: 1,
      pos: pos,
      width: rng.integer(25, 75),
      height: rng.integer(25, 75),
      collisionType: CollisionType.Active,
      color: Color.Transparent,
      collisionGroup: blockcolliderGroup,
      //vel: vec(0, 10),
      //acc: vec(0, 25),
    });

    // check width versus position
    if (this.pos.x + this.width / 2 > 145) this.pos.x = 140 - this.width;
    if (this.pos.x - this.width / 2 < -145) this.pos.x = -140 + this.width / 2;

    this.rng = rng;

    this.body.limitDegreeOfFreedom.push(DegreeOfFreedom.Rotation);
    this.body.useGravity = true;
    this.body.bounciness = 0.05;
    this.body.mass = 100;

    //set max vel by level
    for (let i = 0; i < level; i++) {
      this.maxSpeedX *= 1.1;
    }
  }

  onInitialize(engine: Engine): void {
    this.material = engine.graphicsContext.createMaterial({
      fragmentSource: rockyMaterial,
      name: "rockyMaterial",
    });

    this.graphics.material = this.material;
    const seed = this.rng.next();

    this.material.update((s: Shader) => {
      s.trySetUniformFloat("u_seed", seed);
      s.trySetUniformFloat("u_roughness", 0.8);
      s.trySetUniformFloatColor("u_baseColor", Color.fromHex("#9db01a"));
      s.trySetUniformFloatColor("u_bgColor", Color.fromHex("#5b5c46"));
      s.trySetUniformFloat("u_borderSize", 0.004);
    });
  }

  onPreUpdate(engine: Engine, elapsed: number): void {
    //max vel check
    if (Math.abs(this.vel.y) >= this.maxSpeedX) {
      if (this.vel.y > 0) this.vel.y = this.maxSpeedX;
      if (this.vel.y < 0) this.vel.y = -this.maxSpeedX;
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
