// resources.ts
import { ImageSource, Loader, Sprite, SpriteSheet } from "excalibur";
import pit from "./Assets/pit.png"; // replace this
import well from "./Assets/background.png";
import greenFrog from "./Assets/GreenBrown/ToxicFrogGreenBrown_Sheet.png";
import floorBlock from "./Assets/smallTile.png";
import exit from "./Assets/exit.png";
import rock1 from "./Assets/rocks/Horror_Stone_01-128x128.png";
import rock2 from "./Assets/rocks/Horror_Stone_02-128x128.png";
import rock3 from "./Assets/rocks/Horror_Stone_03-128x128.png";
import rock4 from "./Assets/rocks/Horror_Stone_04-128x128.png";
import rock5 from "./Assets/rocks/Horror_Stone_05-128x128.png";
import rock6 from "./Assets/rocks/Horror_Stone_06-128x128.png";
import rock7 from "./Assets/rocks/Horror_Stone_07-128x128.png";
import rock8 from "./Assets/rocks/Horror_Stone_08-128x128.png";
import rock9 from "./Assets/rocks/Horror_Stone_09-128x128.png";
import rock10 from "./Assets/rocks/Horror_Stone_10-128x128.png";
import rock11 from "./Assets/rocks/Horror_Stone_11-128x128.png";
import rock12 from "./Assets/rocks/Horror_Stone_12-128x128.png";
import rock13 from "./Assets/rocks/Horror_Stone_13-128x128.png";
import rock14 from "./Assets/rocks/Horror_Stone_14-128x128.png";

export const Resources = {
  pit: new ImageSource(pit),
  well: new ImageSource(well),
  greenFrog: new ImageSource(greenFrog),
  floorBlock: new ImageSource(floorBlock),
  exit: new ImageSource(exit),
  rock1: new ImageSource(rock1),
  rock2: new ImageSource(rock2),
  rock3: new ImageSource(rock3),
  rock4: new ImageSource(rock4),
  rock5: new ImageSource(rock5),
  rock6: new ImageSource(rock6),
  rock7: new ImageSource(rock7),
  rock8: new ImageSource(rock8),
  rock9: new ImageSource(rock9),
  rock10: new ImageSource(rock10),
  rock11: new ImageSource(rock11),
  rock12: new ImageSource(rock12),
  rock13: new ImageSource(rock13),
  rock14: new ImageSource(rock14),
};

export const loader = new Loader();

for (let res of Object.values(Resources)) {
  loader.addResource(res);
}
