import { Camera2D } from "../camera";
import { Player } from "../player";
import { GameState } from "./game_state.abstract";
import { EnemyController } from "../controllers/enemy.controller";
import { Level1 } from "../levels/level-1";
import { Level } from "../levels/level.abstract";
import {
  Collidable,
  CollisionController,
} from "../controllers/collision.controller";

import { Enemy, EnemyType } from "../enemies/enemy";
import { WeaponController } from "../controllers/weapon.controller";
import { BaseballBat } from "../weapons/bat";
import { Weapon } from "../weapons/weapon.abstract";

export class GameplayState extends GameState {
  public player: Player; // Replace with actual player type
  private level: Level = new Level1();
  private enemiesController: EnemyController = new EnemyController();
  private weaponsController: WeaponController = new WeaponController();
  private collisionSystem: CollisionController;
  private spawnEnemiesInterval: any;
  private readonly max_enemies = 100;

  constructor() {
    super();
    this.collisionSystem = CollisionController.getInstance();
    this.player = new Player();

    this.weaponsController.registerWeapon(new BaseballBat());
    this.weaponsController.onWeaponRady = (weapon: Weapon) => {
      const randEnemy = this.enemiesController.getRandonEnemy();
      if (randEnemy) this.weaponsController.attack(weapon, this.player, randEnemy);
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
    this.level.update(deltaTime);
  }

  fixedUpdate(fixedDeltaTime: number): void {
    this.collisionSystem.reset();

    this.player.fixedUpdate(fixedDeltaTime);
    this.enemiesController.fixedUpdate(fixedDeltaTime, this.player);
    this.weaponsController.fixedUpdate(fixedDeltaTime);

    // Check collisions
    // Broad phase
    this.collisionSystem
      .query(this.player)
      .forEach((collidable: Collidable) => {
        // Narrow phase

        // Destroy the enemy if it collides with the player
        const enemy = collidable as Enemy;
        if (enemy.hitBox.intersectsBox(this.player.hitBox))
          this.enemiesController.removeEnemy(enemy);
      });

    // Make cam  follow the player
    Camera2D.setPosition(this.player.position);

    this.level.fixedUpdate(fixedDeltaTime);
  }

  render(): void {
    this.level.render();
    this.player.render();
    this.enemiesController.render();
    this.weaponsController.render();
  }

  // TODO: spawn types and quantity by elapsed time
  spawnEnemies(quantity: number) {
    for (let i = 0; i < quantity; i++) {
      const enemyTipe = Math.floor(Math.random() * EnemyType.MaxEnemy);
      this.enemiesController.addEnemy(enemyTipe);
    }
  }
}
