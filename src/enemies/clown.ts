import { Enemy } from "./enemy";

export class Clown extends Enemy {
  constructor(x: number, y: number) {
    super();

    // Spawn position
    this.position.x = x;
    this.position.y = y;

    this.speed = 25;
    this.animationSpeed = 150;

    this.tileSize.x = 64;
    this.tileSize.y = 64;
  }

  updateSprite(): void {
    const MAX_INDEX = 6;
    this.tile_index++;
    this.tile_index %= MAX_INDEX;
  }
}
