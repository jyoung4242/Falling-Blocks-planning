import { Collider, CollisionGroup } from "excalibur";

export const playercolliderGroup: CollisionGroup = new CollisionGroup("playercolliderGroup", 0b0001, 0b0010);
export const blockcolliderGroup: CollisionGroup = new CollisionGroup("blockcolliderGroup", 0b0010, 0b0011);
