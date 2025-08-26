import { Actor, CollisionType, Color, CompositeCollider, EdgeCollider, Engine, Material, Shader, Shape, vec, Vector } from "excalibur";
import { Resources } from "../resources";
import { waterfill } from "../Shaders/waterfill";

export class Pit extends Actor {
  material: Material | null = null;

  fillAmount = 0;
  waterColor = Color.fromHex("#4B5337");
  waterOpacity = 0.5;

  fillTime = 0;
  fillTimeLimit = 100000;

  constructor() {
    let leftEdgeCollider = Shape.Box(5, 590, vec(0, 0), vec(-160, -295));
    let rightEdgeCollider = Shape.Box(5, 590, vec(0, 0), vec(160, -295));
    let bottomEdgeCollider = Shape.Box(320, 50, vec(0, 0), vec(-160, 290));
    let compCollider = new CompositeCollider([leftEdgeCollider, bottomEdgeCollider, rightEdgeCollider]);

    super({
      z: 0,
      collider: compCollider,
      pos: vec(0, 0),
      anchor: Vector.Half,
      collisionType: CollisionType.Fixed,
    });
    this.graphics.use(Resources.well.toSprite());
  }
  onInitialize(engine: Engine): void {
    this.material = engine.graphicsContext.createMaterial({
      name: "waterfill",
      fragmentSource: waterfill,
    });
    engine.currentScene.camera.strategy.lockToActor(this);
  }

  onPreUpdate(engine: Engine, elapsed: number): void {}
}
