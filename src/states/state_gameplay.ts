import { g_Camera } from "../camera";
import { Player } from "../player";
import { GameState } from "./game_state.abstract";
import { EnemyController } from "../controllers/enemy.controller";
import { Enemy, EnemyType } from "../enemies/enemy";
import { Level1 } from "../levels/level-1";
import { Level } from "../levels/level.abstract";
import { CollisionController } from "../controllers/collision.controller";

export class GameplayState extends GameState {
  public player: Player; // Replace with actual player type
  private level: Level = new Level1();
  private enemiesController: EnemyController = new EnemyController();
  private collisionSystem: CollisionController;
  private spawnEnemiesInterval: any;
  private readonly max_enemies = 1;

  // Temp
  private _collisionsCounter = 0;

  constructor() {
    super();

    this.collisionSystem =
      CollisionController.getInstance<CollisionController>();

    this.player = new Player(); // Initialize player
    this.player.nodeId = this.collisionSystem.insert({
      aabb: this.player.hitBox,
      data: { nodeId: this.player.nodeId },
    });

    // TODO: move to stageHandler in the level class
    this.spawnEnemiesInterval = os.setInterval(() => {
      if (this.enemiesController.enemiesCounter >= this.max_enemies) {
        os.clearInterval(this.spawnEnemiesInterval);
        return;
      }
      this.spawnEnemies(1);
    }, 1000);
    // this.spawnEnemies(200);

    this.spawnEnemiesInterval = os.setInterval(() => {
      this.collisionSystem.rebuild();
    }, 5000);
  }

  get enemiesCounter(): number {
    return this.enemiesController.enemiesCounter;
  }

  get collisionsCounter(): number {
    return this._collisionsCounter;
  }

  get objectsCount(): number {
    return this.collisionSystem.countObjects();
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
    // Update player
    this.player.fixedUpdate(fixedDeltaTime);
    this.collisionSystem.update(this.player.nodeId, this.player.hitBox);
    // const playerAABB = this.collisionSystem.get(this.player.nodeId);
    // console.log(
    //   `Player AABB. Center: ${playerAABB?.aabb.getCenter().x}, ${
    //     playerAABB?.aabb.getCenter().y
    //   } | size: ${playerAABB?.aabb.getSize().x}, ${
    //     playerAABB?.aabb.getSize().y
    //   }`
    // );

    // Update enemies
    this.enemiesController.fixedUpdate(fixedDeltaTime, this.player);

    // Check collisions
    this.collisionSystem.query(this.player.hitBox, (obj) => {
      if (obj.data.nodeId == this.player.nodeId) return;

      // Destroy the enemy if it collides with the player
      console.log("Collision with player detected! Removing enemy.");
      this._collisionsCounter++;
      const enemy: Enemy = obj.data;
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
      const enemyTipe = Math.floor(Math.random() * EnemyType.MaxEnemy);
      this.enemiesController.addEnemy(enemyTipe);
    }
  }
}
