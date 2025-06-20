import { Vector2 } from "threejs-math";
import { Enemy } from "./enemy";

export class DemonDoor extends Enemy {
  public readonly tileSize: Vector2 = new Vector2(64, 64);
  public readonly hitboxSize: Vector2 = new Vector2(42, 43);
  public damage: number = 7;
  public health: number = 10;
  public maxHealth: number = 10;

  constructor(x: number, y: number) {
    super(x, y);

    this.speed = 30;
    this.animationSpeed = 200;
  }

  updateSprite(): void {
    const MAX_INDEX = 4;
    this.tileIndex++;
    this.tileIndex %= MAX_INDEX;
  }
}
