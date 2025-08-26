// resources.ts
import { ImageSource, Loader, Sprite, SpriteSheet } from "excalibur";
import pit from "./Assets/pit.png"; // replace this
import well from "./Assets/background.png";

export const Resources = {
  pit: new ImageSource(pit),
  well: new ImageSource(well),
};

export const loader = new Loader();

for (let res of Object.values(Resources)) {
  loader.addResource(res);
}
