import { g_Camera } from "../camera";
import { Weapon } from "../weapons/weapon.abstract";
import { Projectile } from "../projectile/projectile.abstract";
import { Enemy } from "../enemies/enemy";
import { Player } from "../player";
import { Box2, Vector2 } from "threejs-math";

export class WeaponController {
  public onWeaponRady!: (weapon: Weapon) => void;
  private weapons: Weapon[] = [];
  private projectiles: Projectile[] = [];

  get projectilesCount(): number {
    return this.projectiles.length;
  }

  public registerWeapon(weapon: Weapon): void {
    this.weapons.push(weapon);
  }

  public unregisterEnemy(weapon: Weapon): void {
    const i = this.weapons.findIndex((e) => e.getType() === weapon.getType());
    if (i > -1) this.weapons.splice(i, 1);
  }

  public removeExpiredProjectiles(): void {
    this.projectiles = this.projectiles.filter((p) => p.expired === false);
  }

  public update(deltaTime: number): void {
    for (let i = 0; i < this.weapons.length; i++) {
      this.weapons[i].update(deltaTime);
      if (this.weapons[i].isReady()) this.onWeaponRady(this.weapons[i]);
    }

    for (let i = 0; i < this.projectiles.length; i++) {
      this.projectiles[i].update(deltaTime);
    }
  }

  public attack(weapon: Weapon, player: Player, target: Enemy) {
    this.projectiles.push(weapon.attack(player, target));
  }

  public fixedUpdate(fixedDeltaTime: number): void {
    for (let i = 0; i < this.weapons.length; i++) {
      this.weapons[i].fixedUpdate(fixedDeltaTime);
    }

    let projectilesHasChanged = false;
    const screenBox2 = g_Camera.getClippingAABB();

    for (let i = 0; i < this.projectiles.length; i++) {
      const projectile = this.projectiles[i];

      if (!screenBox2.intersectsBox(projectile.aabb)) {
        projectile.expired = true;
        projectilesHasChanged = true;
        continue;
      }

      projectile.fixedUpdate(fixedDeltaTime);
    }

    if (projectilesHasChanged) {
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
