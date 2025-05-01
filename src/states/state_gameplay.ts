import { g_Camera } from "../camera";
import { Player } from "../player";
import { GameState } from "./game_state.abstract";
import { EnemyController } from "../controllers/enemy.controller";
import { Level1 } from "../levels/level-1";
import { Level } from "../levels/level.abstract";
import {
  Collidable,
  CollisionController,
} from "../controllers/collision.controller";

export class GameplayState extends GameState {
  public player: Player; // Replace with actual player type
  private level: Level = new Level1();
  private enemiesController: EnemyController = new EnemyController();
  private collisionSystem: CollisionController;
  private spawnEnemiesInterval: any;
  private readonly max_enemies = 100;

  constructor() {
    super();
    this.collisionSystem = CollisionController.getInstance();
    this.player = new Player();

    // TODO: move to stageHandler in the level class
    this.spawnEnemiesInterval = os.setInterval(() => {
      if (this.enemiesController.enemiesCounter >= this.max_enemies) {
        os.clearInterval(this.spawnEnemiesInterval);
        return;
      }
      this.spawnEnemies(2);
    }, 500);
  }

  get enemiesCounter(): number {
    return this.enemiesController.enemiesCounter;
  }

  get objectsCount(): number {
    return this.enemiesCounter + 1; // +1 for the player
  }

  update(deltaTime: number): void {
    // Update player
    this.player.update(deltaTime);

    // Update enemies
    this.enemiesController.update(deltaTime);

    // Update level
    this.level.update(deltaTime);
  }

  fixedUpdate(fixedDeltaTime: number): void {
    this.collisionSystem.reset();

    // Update player
    this.player.fixedUpdate(fixedDeltaTime);

    // Update enemies
    this.enemiesController.fixedUpdate(fixedDeltaTime, this.player);

    // Check collisions
    // Broad phase
    this.collisionSystem.query(this.player).forEach((enemy: Collidable) => {
      // Narrow phase

      // Destroy the enemy if it collides with the player
      if (enemy.hitBox.intersectsBox(this.player.hitBox))
        this.enemiesController.removeEnemy(enemy);
    });

    // Make cam  follow the player
    g_Camera.setPosition(this.player.position);

    // Update level
    this.level.fixedUpdate(fixedDeltaTime);
  }

  render(): void {
    // Render level
    this.level.render();

    // Render player
    this.player.render();

    // Render enemies
    this.enemiesController.render();
  }

  // TODO: spawn types and quantity by elapsed time
  spawnEnemies(quantity: number) {
    for (let i = 0; i < quantity; i++) {
      const enemyTipe = Math.floor(Math.random() * 1);
      this.enemiesController.addEnemy(enemyTipe);
    }
  }
}
