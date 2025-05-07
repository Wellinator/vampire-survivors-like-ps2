import { Indexable, NodeGeometry } from "@timohausmann/quadtree-ts";
import { Vector2, Box2 } from "threejs-math";
import { CollidableType } from "../constants";

export enum Projectiles {
  Ball,
}

export abstract class Projectile implements Indexable {
  public textureId: number = -1;

  abstract readonly tileSize: Vector2;
  abstract size: Vector2;
  abstract aabb: Box2;

  protected type!: Projectiles;
  protected damage: number;
  protected range: number;
  protected speed: number;
  protected expired: boolean = false;

  public collidable_type!: CollidableType;
  public direction: Vector2 = new Vector2(0, 0);
  public position: Vector2 = new Vector2(0, 0);

  constructor(damage: number, range: number, speed: number) {
    this.damage = damage;
    this.range = range;
    this.speed = speed;
  }

  abstract update(deltaTime: number): void;
  abstract fixedUpdate(fixedDeltaTime: number): void;
  abstract draw(): void;
  abstract qtIndex(node: NodeGeometry): number[];

  public isExpired(): boolean {
    return this.expired;
  }

  public markAsExpired(): void {
    this.expired = true;
  }

  public markAsUnexpired(): void {
    this.expired = false;
  }

  public getDamage(): number {
    return this.damage;
  }
}
