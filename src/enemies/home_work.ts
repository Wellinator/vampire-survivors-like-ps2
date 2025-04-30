import { Enemy } from "./enemy";

export class Homework extends Enemy {
  constructor(x: number, y: number) {
    super();

    // Spawn position
    this.position.x = x;
    this.position.y = y;

    this.speed = 40;
    this.animationSpeed = 200;

    this.tileSize.x = 64;
    this.tileSize.y = 64;

    this.hitboxSize.x = 40;
    this.hitboxSize.y = 32;
  }

  updateSprite(): void {
    const MAX_INDEX = 4;
    this.tile_index++;
    this.tile_index %= MAX_INDEX;
  }
}
