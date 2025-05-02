import { Vector2 } from "threejs-math";
import { Enemy } from "./enemy";

export class Ghost extends Enemy {
  public readonly tileSize: Vector2 = new Vector2(64, 64);
  public readonly hitboxSize: Vector2 = new Vector2(28, 35);
  public damage: number = 5;
  public health: number = 7;
  public maxHealth: number = 7;
  

  constructor(x: number, y: number) {
    super();

    // Spawn position
    this.position.x = x;
    this.position.y = y;

    this.speed = 25;
    this.animationSpeed = 250;

    this.tileSize.x = 64;
    this.tileSize.y = 64;
  }

  updateSprite(): void {
    const MAX_INDEX = 5;
    this.tileIndex++;
    this.tileIndex %= MAX_INDEX;
  }
}
