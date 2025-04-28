import { Vector2 } from "threejs-math";
import { Player } from "../player";

export enum EnemyType {
  Clown,
  DemonDoor,
  Homework,
  FourEyesBug,
  Ghost,
  MaxEnemy,
}

export abstract class Enemy {
  id: number = 0;

  textureID: number = 0;

  tile_index: number = 0;

  tileWidth: number = 0;

  tileHeight: number = 0;

  animationSpeed: number = 500;

  elapsedAnimationTime: number;

  speed: number = 50;

  /** @type {Vector2} */
  velocity: Vector2 = new Vector2(0, 0);

  /** @type {Vector2} */
  direction: Vector2 = new Vector2(0, 0);

  /** @type {Vector2} */
  position: Vector2 = new Vector2(0, 0);

  constructor() {
    this.elapsedAnimationTime = 0;
  }

  update(deltaTime: number) {}

  fixedUpdate(fixedDeltaTime: number, player: Player) {
    this.elapsedAnimationTime += fixedDeltaTime;
    if (this.elapsedAnimationTime >= this.animationSpeed) {
      this.updateSprite();
      this.elapsedAnimationTime = 0;
    }

    // Set enemy direction by player
    this.direction = player
      .getCenteredPosition()
      .sub(this.position)
      .normalize();

    const velocity = (this.speed * fixedDeltaTime) / 1000;
    this.position.add(this.direction.clone().multiplyScalar(velocity));
  }

  abstract updateSprite(): void;
}
