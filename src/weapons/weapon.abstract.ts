import { Vector2 } from "threejs-math";
import { Projectile } from "../projectile/projectile.abstract";

export enum Weapons {
  BaseballBat,
}

export abstract class Weapon {
  protected type!: Weapons;
  protected name: string;
  protected damage: number;
  protected cooldown: number;
  protected range: number;
  protected speed: number;

  constructor(
    name: string,
    damage: number,
    cooldown: number,
    range: number,
    speed: number
  ) {
    this.name = name;
    this.damage = damage;
    this.cooldown = cooldown;
    this.range = range;
    this.speed = speed;
  }

  abstract update(deltaTime: number): void;
  abstract fixedUpdate(fixedDeltaTime: number): void;
  abstract attack(origin: Vector2, target: Vector2): Projectile;
  abstract registerTextures(): void;

  public getType(): Weapons {
    return this.type;
  }

  // Method to get weapon stats
  getStats(): string {
    return `Name: ${this.name}, Damage: ${this.damage}, Cooldown: ${this.cooldown}s, Range: ${this.range}`;
  }

  // Method to reduce cooldown (called every frame or tick)
  reduceCooldown(deltaTime: number): void {
    if (this.cooldown > 0) {
      this.cooldown = Math.max(0, this.cooldown - deltaTime);
    }
  }

  // Check if the weapon is ready to attack
  isReady(): boolean {
    return this.cooldown <= 0;
  }
}
