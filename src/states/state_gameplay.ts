import { Camera2D } from "../camera";
import { Player } from "../player";
import { GameState } from "./game_state.abstract";
import { EnemyController } from "../controllers/enemy.controller";
import { Level1 } from "../levels/level-1";
import { Level } from "../levels/level.abstract";
import { Enemy, EnemyType } from "../enemies/enemy";
import { WeaponController } from "../controllers/weapon.controller";
import { BaseballBat } from "../weapons/bat";
import { Weapon } from "../weapons/weapon.abstract";
import { Projectile } from "../projectile/projectile.abstract";
import { CollectableController } from "../controllers/collectable.controller";
import {
  Collectable,
  CollectableType,
} from "../collectables/collectable.abstract";
import { Vector2 } from "threejs-math";
import { Circle } from "@timohausmann/quadtree-ts";

export class GameplayState extends GameState {
  public player: Player; // Replace with actual player type
  private level: Level = new Level1();
  private enemiesController: EnemyController;
  private weaponsController: WeaponController;
  private collectableController: CollectableController;
  private spawnEnemiesInterval: any;
  private readonly max_enemies = 5;

  constructor() {
    super();

    this.enemiesController = new EnemyController();
    this.weaponsController = new WeaponController();
    this.collectableController = new CollectableController();

    this.player = new Player();
    this.player.onLeveUp = () => {
      // TODO: open weapons upgrade menu
      console.log("Level up! lvl: ", this.player.level);
    };

    this.weaponsController.registerWeapon(new BaseballBat());
    this.weaponsController.onWeaponRady = (weapon: Weapon) => {
      const randEnemy = this.enemiesController.getRandonEnemy();
      if (randEnemy)
        this.weaponsController.attack(
          weapon,
          this.player.position,
          randEnemy.position
        );
    };

    // TODO: move to stageHandler in the level class
    this.spawnEnemiesInterval = os.setInterval(() => {
      if (this.enemiesController.enemiesCounter >= this.max_enemies) return;
      this.spawnEnemies(2);
    }, 500);
  }

  get enemiesCounter(): number {
    return this.enemiesController.enemiesCounter;
  }

  get objectsCount(): number {
    return this.enemiesCounter + 1; // +1 for the player
  }

  get projectilesCount(): number {
    return this.weaponsController.projectilesCount;
  }

  update(deltaTime: number): void {
    this.player.update(deltaTime);
    this.enemiesController.update(deltaTime);
    this.weaponsController.update(deltaTime);
    this.collectableController.update(deltaTime);
    this.level.update(deltaTime);
  }

  fixedUpdate(fixedDeltaTime: number): void {
    this.player.fixedUpdate(fixedDeltaTime);
    this.enemiesController.fixedUpdate(fixedDeltaTime, this.player);
    this.weaponsController.fixedUpdate(fixedDeltaTime);
    this.collectableController.fixedUpdate(fixedDeltaTime);

    // Check collisions

    // Projectiles VS Enemies
    this.weaponsController
      .getProjectiles()
      .forEach((projectile: Projectile) => {
        this.enemiesController
          .intersects(projectile)
          .forEach((enemy: Enemy) => {
            if (enemy.hitBox.intersectsBox(projectile.aabb)) {
              this.weaponsController.removeProjectile(projectile);

              if (enemy.isAlive()) {
                enemy.takeDamage(projectile.getDamage());
                if (!enemy.isAlive()) {
                  const removed = this.enemiesController.remove(enemy);
                  if (removed) {
                    this.collectableController.add(
                      CollectableType.Xp,
                      enemy.position.clone()
                    );
                  }
                }
              }
            }
          });
      });

    // Player VS Enemies
    // Broad phase
    this.enemiesController.intersects(this.player).forEach((enemy: Enemy) => {
      // Narrow phase
      if (enemy.hitBox.intersectsBox(this.player.hitBox))
        if (this.player.isAlive()) this.player.takeDamage(enemy.damage);
    });

    // Player VS Collectables
    // Broad phase
    const circleQuery = new Circle({
      r: this.player.magnetOrbRange,
      x: this.player.position.x,
      y: this.player.position.y,
    });

    // Braod phase
    this.collectableController
      .intersects(circleQuery)
      .forEach((collectable: Collectable) => {
        // Narrow phase
        // Update collectable position by magnetism
        collectable.setDirectionFromTarget(this.player.position);

        if (!collectable.attracting) {
          const collide = this.player.hitBox
            .clone()
            .expandByScalar(this.player.magnetOrbRange)
            .intersectsBox(collectable.aabb);

          if (collide) {
            const lift = new Vector2(-5, -5);
            collectable.velocity.copy(lift);
            collectable.attracting = true;
          }
        }

        // If collides to player, collect it;
        if (collectable.getExpandedAABB().intersectsBox(this.player.hitBox)) {
          collectable.onCollect(this.player);
          collectable.collected = true;
          this.collectableController.remove(collectable.id);
        }
      });

    // Make cam  follow the player
    Camera2D.setPosition(this.player.position);

    this.level.fixedUpdate(fixedDeltaTime);
  }

  render(): void {
    this.level.render();
    this.player.render();
    this.collectableController.render();
    this.enemiesController.render();
    this.weaponsController.render();

    // TODO: move to HUD
    this.player.renderHP();
    this.player.renderXP();
  }

  // TODO: spawn types and quantity by elapsed time
  spawnEnemies(quantity: number) {
    for (let i = 0; i < quantity; i++) {
      const enemyTipe = Math.floor(Math.random() * EnemyType.MaxEnemy);
      this.enemiesController.addEnemy(enemyTipe);
    }
  }
}
