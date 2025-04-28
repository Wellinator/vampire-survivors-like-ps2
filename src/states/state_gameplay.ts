import { globalPosPad } from "../fake_camera";
import { Player } from "../player";
import { GameState } from "./game_state.abstract";
import { EnemyController } from "../controllers/enemy.controller";
import { EnemyType } from "../enemies/enemy";

export class GameplayState extends GameState {
  public player: Player; // Replace with actual player type
  private enemiesController: EnemyController = new EnemyController();
  private spawnEnemiesInterval: any;
  private readonly max_enemies = 200;

  constructor() {
    super();
    this.player = new Player(); // Initialize player

    // TODO: move to stageHandler in the level class
    this.spawnEnemiesInterval = os.setInterval(() => {
      if (this.enemiesController.enemiesCounter >= this.max_enemies) {
        os.clearInterval(this.spawnEnemiesInterval);
        return;
      }
      this.spawnEnemies(3);
    }, 1500);

    // this.spawnEnemies(150);
  }

  get enemiesCounter(): number {
    return this.enemiesController.enemiesCounter;
  }

  update(deltaTime: number): void {
    // Update player
    this.player.update(deltaTime);

    // Update enemies
    this.enemiesController.update(deltaTime);
  }

  fixedUpdate(fixedDeltaTime: number): void {
    // Update player
    this.player.fixedUpdate(fixedDeltaTime);

    // Update enemies
    this.enemiesController.fixedUpdate(fixedDeltaTime, this.player);

    // Make cam fallow the player
    globalPosPad.x = this.player.position.x;
    globalPosPad.y = this.player.position.y;
  }

  render(): void {
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
