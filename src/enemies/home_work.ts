import { Vector2 } from "threejs-math";
import { Enemy } from "./enemy";

export class Homework extends Enemy {
  public readonly tileSize: Vector2 = new Vector2(64, 64);
  public readonly hitboxSize: Vector2 = new Vector2(40, 32);
  public damage: number = 2;
  public health: number = 5;

  constructor(x: number, y: number) {
    super();

    // Spawn position
    this.position.x = x;
    this.position.y = y;

    this.speed = 40;
    this.animationSpeed = 200;
  }

  updateSprite(): void {
    const MAX_INDEX = 4;
    this.tileIndex++;
    this.tileIndex %= MAX_INDEX;
  }
}
