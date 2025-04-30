import { Vector2, Box2 } from "threejs-math";
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

  nodeId: number = 0;

  isAlive: boolean = false;

  textureID: number = 0;

  tile_index: number = 0;

  tileSize: Vector2 = new Vector2(0, 0);

  animationSpeed: number = 500;

  elapsedAnimationTime: number;

  speed: number = 50;

  velocity: Vector2 = new Vector2(0, 0);

  direction: Vector2 = new Vector2(0, 0);

  position: Vector2 = new Vector2(0, 0);

  hitBox: Box2 = new Box2(new Vector2(0, 0), new Vector2(0, 0));

  constructor() {
    this.elapsedAnimationTime = 0;
    this.isAlive = true;
  }

  update(deltaTime: number) {}

  fixedUpdate(fixedDeltaTime: number, player: Player) {
    this.elapsedAnimationTime += fixedDeltaTime;
    if (this.elapsedAnimationTime >= this.animationSpeed) {
      this.updateSprite();
      this.elapsedAnimationTime = 0;
    }

    // Set enemy direction by player
    this.direction = player.position.clone().sub(this.position).normalize();

    const velocity = (this.speed * fixedDeltaTime) / 1000;
    this.position.add(this.direction.clone().multiplyScalar(velocity));

    // Update hitBox by new position
    this.hitBox.setFromCenterAndSize(this.position, this.tileSize);
  }

  abstract updateSprite(): void;
}
