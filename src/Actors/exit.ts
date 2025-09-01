import { Actor, CollisionType, vec } from "excalibur";
import { Resources } from "../resources";
import { exitCollisionGroup } from "../collisionGroups";

export class Exit extends Actor {
  constructor() {
    super({
      x: 0,
      y: -300,
      radius: 16,
      z: 10,
      scale: vec(2, 2),
      collisionType: CollisionType.Passive,
      collisionGroup: exitCollisionGroup,
    });

    this.graphics.use(Resources.exit.toSprite());
  }
}
