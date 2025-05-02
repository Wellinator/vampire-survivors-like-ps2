import { Vector2 } from "threejs-math";
import { Enemy } from "./enemy";

export class FourEyesBug extends Enemy {
  public readonly tileSize: Vector2 = new Vector2(64, 64);
  public readonly hitboxSize: Vector2 = new Vector2(40, 30);
  public damage: number = 5;
  public health: number = 5;
  public maxHealth: number = 5;

  constructor(x: number, y: number) {
    super(x, y);

    this.speed = 40;
    this.animationSpeed = 200;
  }

  updateSprite() {
    const MAX_INDEX = 4;
    this.tileIndex++;
    this.tileIndex %= MAX_INDEX;
  }
}
