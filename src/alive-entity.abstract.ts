import { Entity } from "./entity.abstract";

export abstract class AliveEntity extends Entity {
  private health: number = 0;

  constructor() {
    super();
  }

  public getHealth(): number {
    return this.health;
  }

  takeDamage(amount: number): void {
    this.health -= amount;
    if (this.health < 0) {
      this.health = 0;
    }
  }

  isAlive(): boolean {
    return this.health > 0;
  }
}
