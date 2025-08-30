// resources.ts
import { ImageSource, Loader, Sprite, SpriteSheet } from "excalibur";
import pit from "./Assets/pit.png"; // replace this
import well from "./Assets/background.png";
import greenFrog from "./Assets/GreenBrown/ToxicFrogGreenBrown_Sheet.png";
import floorBlock from "./Assets/smallTile.png";

export const Resources = {
  pit: new ImageSource(pit),
  well: new ImageSource(well),
  greenFrog: new ImageSource(greenFrog),
  floorBlock: new ImageSource(floorBlock),
};

export const loader = new Loader();

for (let res of Object.values(Resources)) {
  loader.addResource(res);
}
