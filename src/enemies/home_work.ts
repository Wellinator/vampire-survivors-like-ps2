import { Enemy } from "./enemy";

export class Homework extends Enemy {
  constructor(x: number, y: number) {
    super();

    // Spawn position
    this.position.x = x;
    this.position.y = y;

    this.speed = 40;
    this.animationSpeed = 200;

    this.tileWidth = 64;
    this.tileHeight = 64;
  }

  updateSprite(): void {
    const MAX_INDEX = 4;
    this.tile_index++;
    this.tile_index %= MAX_INDEX;
  }
}
