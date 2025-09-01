import { Actor, Blink, Color, Flash, ScreenElement, vec, Vector } from "excalibur";

export class DropWarning extends Actor {
  constructor(pos: Vector, width: number) {
    super({
      pos: vec(pos.x, -315),
      width: width,
      height: 5,
      color: Color.Red,
      z: 1000,
    });

    /*  let blinkAction = new Flash(this, Color.White, 1000);

    this.actions
      .runAction(blinkAction)
      .toPromise()
      .then(() => {
        this.kill();
      }); */
    setTimeout(() => this.kill(), 1000);
  }
}
