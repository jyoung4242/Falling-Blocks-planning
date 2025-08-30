import {
  Actor,
  CollisionType,
  Color,
  CompositeCollider,
  EdgeCollider,
  Engine,
  GraphicsGroup,
  Material,
  Shader,
  Shape,
  vec,
  Vector,
} from "excalibur";
import { Resources } from "../resources";
import { waterfill } from "../Shaders/waterfill";

export class Pit extends Actor {
  fillAmount = 0;
  waterColor = Color.fromHex("#4B5337");
  waterOpacity = 0.5;

  fillTime = 0;
  fillTimeLimit = 100000;

  gg: GraphicsGroup;

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
    this.gg = new GraphicsGroup({
      useAnchor: true,
      members: [
        { graphic: Resources.well.toSprite(), offset: vec(0, 0) },
        { graphic: Resources.floorBlock.toSprite(), offset: vec(26, 608) },
        { graphic: Resources.floorBlock.toSprite(), offset: vec(26 + 24 * 2, 608) },
        { graphic: Resources.floorBlock.toSprite(), offset: vec(26 + 24 * 1, 608) },
        { graphic: Resources.floorBlock.toSprite(), offset: vec(26 + 24 * 3, 608) },
        { graphic: Resources.floorBlock.toSprite(), offset: vec(26 + 24 * 4, 608) },
        { graphic: Resources.floorBlock.toSprite(), offset: vec(26 + 24 * 5, 608) },
        { graphic: Resources.floorBlock.toSprite(), offset: vec(26 + 24 * 6, 608) },
        { graphic: Resources.floorBlock.toSprite(), offset: vec(26 + 24 * 7, 608) },
        { graphic: Resources.floorBlock.toSprite(), offset: vec(26 + 24 * 8, 608) },
        { graphic: Resources.floorBlock.toSprite(), offset: vec(26 + 24 * 9, 608) },
        { graphic: Resources.floorBlock.toSprite(), offset: vec(26 + 24 * 10, 608) },
        { graphic: Resources.floorBlock.toSprite(), offset: vec(26 + 24 * 11, 608) },
        { graphic: Resources.floorBlock.toSprite(), offset: vec(26 + 24 * 12, 608) },
      ],
    });
    this.graphics.use(this.gg);
  }
  onInitialize(engine: Engine): void {
    engine.currentScene.camera.strategy.lockToActor(this);
  }

  onPreUpdate(engine: Engine, elapsed: number): void {}
}
