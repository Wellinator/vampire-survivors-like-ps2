import { globalPosPad } from "../fake_camera";
import { Player } from "../player";
import { GameState } from "./game_state.abstract";
import { EnemyController } from "../controllers/enemy.controller";
import { EnemyType } from "../enemies/enemy";
import { Level1 } from "../levels/level-1";
import { Level } from "../levels/level.abstract";

export class GameplayState extends GameState {
  public player: Player; // Replace with actual player type
  private level: Level = new Level1();
  private enemiesController: EnemyController = new EnemyController();
  private spawnEnemiesInterval: any;
  private readonly max_enemies = 15;

  constructor() {
    super();
    this.player = new Player(); // Initialize player

    // TODO: move to stageHandler in the level class
    this.spawnEnemiesInterval = os.setInterval(() => {
      if (this.enemiesController.enemiesCounter >= this.max_enemies) {
        os.clearInterval(this.spawnEnemiesInterval);
        return;
      }
      this.spawnEnemies(1);
    }, 1000);

    // this.spawnEnemies(200);
  }

  get enemiesCounter(): number {
    return this.enemiesController.enemiesCounter;
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

    // Update enemies
    this.enemiesController.fixedUpdate(fixedDeltaTime, this.player);

    // Make cam  follow the player
    globalPosPad.x = this.player.position.x;
    globalPosPad.y = this.player.position.y;

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
