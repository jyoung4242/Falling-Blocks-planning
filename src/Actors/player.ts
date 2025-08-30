import {
  Actor,
  Animation,
  AnimationStrategy,
  Collider,
  CollisionContact,
  CollisionType,
  DegreeOfFreedom,
  Engine,
  Keys,
  Material,
  Shader,
  Side,
  SpriteSheet,
  vec,
} from "excalibur";
import { Resources } from "../resources";
import { staminaShader } from "../Shaders/stamina";
import { playercolliderGroup } from "../collisionGroups";
import { Block } from "./block";

// define stamina costs
// jumping - 5 units
// doublejump - 10 units
// being underwater - 1 units/second
// hit by falling block - 25 units

export class FrogPlayer extends Actor {
  maxStamina = 100;
  currentStamina = 100;
  staminaRechargeRate = 1.5;
  material: Material | null = null;

  maxSpeedX = 175;
  terminalVelocity = 10000;
  accSpeed = 900;
  jumpSpeed = -350;
  direction: "Left" | "Right" = "Right";
  keysHeld: Set<Keys> = new Set();
  isJumping = false;
  isOnGround = true;
  isFalling = false;

  constructor() {
    super({
      scale: vec(1.25, 1.25),
      z: 3,
      radius: 10,
      collisionType: CollisionType.Active,
      collisionGroup: playercolliderGroup,
    });
    this.graphics.use(frogAnimationIdleRight);
    this.body.useGravity = true;
    this.body.mass = 1;
    this.body.limitDegreeOfFreedom.push(DegreeOfFreedom.Rotation);
  }

  onInitialize(engine: Engine): void {
    this.material = engine.graphicsContext.createMaterial({
      name: "stamina",
      fragmentSource: staminaShader,
    });

    this.graphics.material = this.material;
  }

  onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
    if (other.owner instanceof Block && side == Side.Top) {
      this.currentStamina -= 25;
    }
  }

  keyDown(key: Keys) {
    if (key == Keys.Left || key == Keys.Right || key == Keys.Space) {
      this.keysHeld.add(key);
      if (key == Keys.Space) return;
      this.direction = key == Keys.Left ? "Left" : "Right";
    }
  }

  keyUp(key: Keys) {
    if (this.keysHeld.has(key)) this.keysHeld.delete(key);
  }

  onPreUpdate(engine: Engine, elapsed: number): void {
    //update stamina shader
    this.material?.update((s: Shader) => {
      s.trySetUniformFloat("u_maxStamina", this.maxStamina);
      s.trySetUniformFloat("u_currentStamina", this.currentStamina);
    });

    // Manage jumping - only start jump if on ground
    if (this.keysHeld.has(Keys.Space) && !this.isJumping && this.isOnGround && this.currentStamina > 5) {
      this.isJumping = true;
      this.isOnGround = false;
      // Apply jump impulse immediately when jump starts
      this.body.applyImpulse(vec(0, 0), vec(0, this.jumpSpeed));
      this.currentStamina -= 5;
    }

    //manage acceleration and velocity first
    if (this.keysHeld.has(Keys.Left) || this.keysHeld.has(Keys.Right)) {
      this.acc.x = this.direction == "Left" ? -this.accSpeed : this.accSpeed;
    } else {
      this.acc.x = 0;
      this.vel.x = 0;
    }

    // then manage max speed
    if (Math.abs(this.vel.x) >= this.maxSpeedX) {
      console.log("max speed reached");

      if (this.vel.x > 0) this.vel.x = this.maxSpeedX;
      if (this.vel.x < 0) this.vel.x = -this.maxSpeedX;
    }

    // Reset jumping state when landing
    if (this.isJumping && this.isOnGround) {
      this.isJumping = false;
    }

    if (this.isJumping && this.isFalling && this.vel.y < 5 && this.vel.y > -5) {
      this.isFalling = false;
      this.isOnGround = true;
      this.isJumping = false;
      this.vel.y = 0;
    }

    //manage animations

    if (this.isJumping) {
      let jumpAnimation = this.direction == "Left" ? frogJumpLeftAnimationSequence : frogJumpRightAnimationSequence;
      let frameIndex = 0;
      //depending on vec.y, change sprite
      if (this.vel.y < -87) {
        frameIndex = 3;
      } else if (this.vel.y > -10 && this.vel.y < 10) {
        this.isFalling = true;
        frameIndex = 4;
      } else if (this.vel.y > 10) {
        frameIndex = 5;
      }

      this.graphics.use(jumpAnimation[frameIndex]);
    } else {
      if (this.direction == "Right" && this.acc.x > 0) {
        this.graphics.use(frogHopRight);
      } else if (this.direction == "Left" && this.acc.x < 0) {
        this.graphics.use(frogHopLeft);
      } else {
        if (this.direction == "Left") {
          this.graphics.use(frogAnimationIdleLeft);
        } else {
          this.graphics.use(frogAnimationIdleRight);
        }
      }
    }

    //manage stamina
    if (this.currentStamina <= 0) {
      this.currentStamina = 0;
    } else if (this.currentStamina >= this.maxStamina) {
      this.currentStamina = this.maxStamina;
    } else {
      //slowly recharge stamina using charge rate
      this.currentStamina += (this.staminaRechargeRate * elapsed) / 500;
    }
  }
}

const greenFrogSS = SpriteSheet.fromImageSource({
  image: Resources.greenFrog,
  grid: {
    rows: 5,
    columns: 9,
    spriteWidth: 48,
    spriteHeight: 48,
  },
});

const frogAnimationIdleRight = Animation.fromSpriteSheetCoordinates({
  spriteSheet: greenFrogSS,
  frameCoordinates: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 },
    { x: 4, y: 0 },
    { x: 5, y: 0 },
    { x: 6, y: 0 },
    { x: 7, y: 0 },
  ],
  durationPerFrame: 100,
  strategy: AnimationStrategy.Loop,
});

const frogAnimationIdleLeft = frogAnimationIdleRight.clone();
frogAnimationIdleLeft.flipHorizontal = true;

const frogHopRight = Animation.fromSpriteSheetCoordinates({
  spriteSheet: greenFrogSS,
  frameCoordinates: [
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 3, y: 1 },
    { x: 4, y: 1 },
    { x: 5, y: 1 },
    { x: 6, y: 1 },
  ],
  durationPerFrame: 100,
  strategy: AnimationStrategy.Loop,
});

const frogHopLeft = frogHopRight.clone();
frogHopLeft.flipHorizontal = true;

const frogJumpRightAnimationSequence = [
  greenFrogSS.getSprite(0, 1).clone(),
  greenFrogSS.getSprite(1, 1).clone(),
  greenFrogSS.getSprite(2, 1).clone(),
  greenFrogSS.getSprite(3, 1).clone(),
  greenFrogSS.getSprite(4, 1).clone(),
  greenFrogSS.getSprite(5, 1).clone(),
  greenFrogSS.getSprite(6, 1).clone(),
];

const frogJumpLeftAnimationSequence = [
  greenFrogSS.getSprite(0, 1).clone(),
  greenFrogSS.getSprite(1, 1).clone(),
  greenFrogSS.getSprite(2, 1).clone(),
  greenFrogSS.getSprite(3, 1).clone(),
  greenFrogSS.getSprite(4, 1).clone(),
  greenFrogSS.getSprite(5, 1).clone(),
  greenFrogSS.getSprite(6, 1).clone(),
];

frogJumpLeftAnimationSequence.forEach(sprite => (sprite.flipHorizontal = true));
