import { Vector2, Box2 } from "threejs-math";
import { Camera2D } from "../camera";
import { Indexable, NodeGeometry, Rectangle } from "@timohausmann/quadtree-ts";
import { Alive } from "../alive.abstract";
import { Hostile } from "../hostile.abstract";
import { Entity } from "../entity.abstract";
import { GameTimer } from "../timer";
import { Collidable } from "../controllers/collision.controller";
import { CollidableType } from "../constants";

export enum EnemyType {
  Clown,
  DemonDoor,
  Homework,
  FourEyesBug,
  Ghost,
  MaxEnemy,
}

export abstract class Enemy
  extends Entity
  implements Collidable, Alive, Hostile
{
  public collidable_type: CollidableType = CollidableType.Enemy;
  public animationSpeed: number = 500;
  public elapsedAnimationTime: number;
  public speed: number = 50;
  public velocity: Vector2 = new Vector2(0, 0);
  public direction: Vector2 = new Vector2(0, 0);
  public position: Vector2 = new Vector2(0, 0);
  public hitBox: Box2 = new Box2(new Vector2(0, 0), new Vector2(0, 0));

  abstract damage: number;
  abstract health: number;
  abstract maxHealth: number;

  constructor(x: number, y: number) {
    super();

    // Spawn position
    this.position.x = x;
    this.position.y = y;
    this.position_start.copy(this.position);
    this.position_end.copy(this.position);

    this.elapsedAnimationTime = 0;
  }

  // From Alive interface
  public getHealth(): number {
    return this.health;
  }

  public takeDamage(amount: number): void {
    this.health -= amount;
    if (this.health < 0) {
      this.health = 0;
    }
  }

  public isAlive(): boolean {
    return this.health > 0;
  }

  qtIndex(node: NodeGeometry): number[] {
    return Rectangle.prototype.qtIndex.call(
      {
        x: this.position.x,
        y: this.position.y,
        width: this.hitboxSize.x,
        height: this.hitboxSize.y,
      },
      node
    );
  }

  public update(deltaTime: number) {
    this.position.lerpVectors(
      this.position_start,
      this.position_end,
      GameTimer.getInstance().Lerp
    );
  }

  public render() {}

  public setDirection(target: Vector2) {
    this.direction = target.clone().sub(this.position).normalize();
  }

  public fixedUpdate(fixedDeltaTime: number) {
    this.position_start.copy(this.position_end);

    this.elapsedAnimationTime += fixedDeltaTime;
    if (this.elapsedAnimationTime >= this.animationSpeed) {
      this.updateSprite();
      this.elapsedAnimationTime = 0;
    }

    const velocity = (this.speed * fixedDeltaTime) / 1000;
    this.position_end.add(this.direction.clone().multiplyScalar(velocity));

    // Update hitBox by new position
    this.hitBox.setFromCenterAndSize(this.position_end, this.hitboxSize);
  }

  public renderHitBox(): void {
    const pos = Camera2D.toScreenSpace(this.hitBox.min.clone()); // Convert to screen space
    Draw.rect(
      pos.x,
      pos.y,
      this.hitboxSize.x,
      this.hitboxSize.y,
      Color.new(255, 0, 0, 128)
    );
  }

  public applyDamage(target: Alive): void {
    target.takeDamage(this.damage);
  }
}
