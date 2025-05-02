import { Vector2 } from "threejs-math";
import { Enemy } from "./enemy";

export class Clown extends Enemy {
  public readonly tileSize: Vector2 = new Vector2(64, 64);
  public readonly hitboxSize: Vector2 = new Vector2(20, 40);
  public damage: number = 7;
  public health: number = 15;
  public maxHealth: number = 15;

  constructor(x: number, y: number) {
    super();

    // Spawn position
    this.position.x = x;
    this.position.y = y;

    this.speed = 25;
    this.animationSpeed = 150;
  }

  updateSprite(): void {
    const MAX_INDEX = 6;
    this.tileIndex++;
    this.tileIndex %= MAX_INDEX;
  }
}
