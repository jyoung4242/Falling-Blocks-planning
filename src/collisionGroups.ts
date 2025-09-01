import { Collider, CollisionGroup } from "excalibur";

export const playercolliderGroup: CollisionGroup = new CollisionGroup("playercolliderGroup", 0b0001, 0b0110);
export const blockcolliderGroup: CollisionGroup = new CollisionGroup("blockcolliderGroup", 0b0010, 0b0011);
export const exitCollisionGroup: CollisionGroup = new CollisionGroup("exitCollisionGroup", 0b0100, 0b0001);
