import { Camera2D } from "../camera";
import { Weapon } from "../weapons/weapon.abstract";
import { Projectile } from "../projectile/projectile.abstract";
import { Vector2 } from "threejs-math";

export class WeaponController {
  public onWeaponRady!: (weapon: Weapon) => void;
  private weapons: Weapon[] = [];
  private projectiles: Projectile[] = [];

  // Proprerty used for cache control
  private projectilesHasChanged = false;

  get projectilesCount(): number {
    return this.projectiles.length;
  }

  getProjectiles(): Array<Projectile> {
    return this.projectiles;
  }

  public registerWeapon(weapon: Weapon): void {
    this.weapons.push(weapon);
  }

  public unregisterEnemy(weapon: Weapon): void {
    const i = this.weapons.findIndex((e) => e.getType() === weapon.getType());
    if (i > -1) this.weapons.splice(i, 1);
  }

  public removeProjectile(projectile: Projectile): void {
    projectile.markAsExpired();
    this.projectilesHasChanged = true;
  }

  private removeExpiredProjectiles(): void {
    this.projectiles = this.projectiles.filter((p) => p.isExpired() === false);
  }

  public update(deltaTime: number): void {
    let len = this.weapons.length;
    while (len--) {
      this.weapons[len].update(deltaTime);
      if (this.weapons[len].isReady()) this.onWeaponRady(this.weapons[len]);
    }

    len = this.projectiles.length;
    while (len--) {
      this.projectiles[len].update(deltaTime);
    }
  }

  public attack(weapon: Weapon, origin: Vector2, target: Vector2) {
    this.projectiles.push(weapon.attack(origin, target));
  }

  public fixedUpdate(fixedDeltaTime: number): void {
    for (let i = 0; i < this.weapons.length; i++) {
      this.weapons[i].fixedUpdate(fixedDeltaTime);
    }

    const screenBox2 = Camera2D.getClippingAABB();

    for (let i = 0; i < this.projectiles.length; i++) {
      const projectile = this.projectiles[i];
      projectile.fixedUpdate(fixedDeltaTime);

      if (!screenBox2.intersectsBox(projectile.aabb)) {
        projectile.markAsExpired();
        this.projectilesHasChanged = true;
        continue;
      }
    }

    if (this.projectilesHasChanged) {
      this.removeExpiredProjectiles();
    }
  }

  public render(): void {
    for (let i = 0; i < this.projectiles.length; i++) {
      this.projectiles[i].draw();
    }
  }

  public clearAll(): void {
    this.weapons = [];
    this.projectiles = [];
  }
}
