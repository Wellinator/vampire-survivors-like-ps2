import { Vector2 } from "threejs-math";
import { Clown } from "../enemies/clown";
import { DemonDoor } from "../enemies/demon_door";
import { Enemy, EnemyType } from "../enemies/enemy";
import { FourEyesBug } from "../enemies/four_yeyes_bug";
import { Ghost } from "../enemies/ghost";
import { Homework } from "../enemies/home_work";
import { Camera2D } from "../camera";
import { SCREEN_VECTOR } from "../scripts/init/init-screen";
import TextureManager from "../texture_manager";
import { Player } from "../player";
import { CollisionController } from "./collision.controller";
import { randInt } from "../mathutils.js";
import { Rectangle } from "@timohausmann/quadtree-ts";

export class EnemyController {
  private id_counter: number = 1;
  private enemies: Enemy[] = [];
  private collisionSystem: CollisionController;
  private TextureRepository = {
    Clown: 0,
    DemonDoor: 0,
    Homework: 0,
    FourEyesBug: 0,
    Ghost: 0,
  };

  constructor() {
    this.collisionSystem =
      CollisionController.getInstance<CollisionController>();
    this.registerTextures();
  }

  get enemiesCounter(): number {
    return this.enemies.length;
  }

  private registerTextures(): void {
    const tm = TextureManager.getInstance<TextureManager>();
    this.TextureRepository.Clown = tm.loadTexture(
      "./assets/sprites/enemies/clown-spritesheet.png"
    );
    this.TextureRepository.DemonDoor = tm.loadTexture(
      "./assets/sprites/enemies/demondoor-spritesheet.png"
    );
    this.TextureRepository.Homework = tm.loadTexture(
      "./assets/sprites/enemies/homework-spritesheet.png"
    );
    this.TextureRepository.FourEyesBug = tm.loadTexture(
      "./assets/sprites/enemies/4eyebug-spritesheet.png"
    );
    this.TextureRepository.Ghost = tm.loadTexture(
      "./assets/sprites/enemies/ghost-spritesheet.png"
    );
  }

  addEnemy(enemy: EnemyType): Enemy {
    let newEnemy: Enemy;

    const spawnPosScreenSpace: Vector2 = this.getRandomPositionAtScreemBorder(
      0,
      SCREEN_VECTOR.x,
      0,
      SCREEN_VECTOR.y,
      32
    );

    const spawnPos = Camera2D.toWorldSpace(spawnPosScreenSpace); // Convert to world space

    switch (enemy) {
      case EnemyType.Ghost:
        newEnemy = new Ghost(spawnPos.x, spawnPos.y);
        newEnemy.textureId = this.TextureRepository.Ghost;
        break;
      case EnemyType.Clown:
        newEnemy = new Clown(spawnPos.x, spawnPos.y);
        newEnemy.textureId = this.TextureRepository.Clown;
        break;
      case EnemyType.DemonDoor:
        newEnemy = new DemonDoor(spawnPos.x, spawnPos.y);
        newEnemy.textureId = this.TextureRepository.DemonDoor;
        break;
      case EnemyType.Homework:
        newEnemy = new Homework(spawnPos.x, spawnPos.y);
        newEnemy.textureId = this.TextureRepository.Homework;
        break;
      case EnemyType.FourEyesBug:
        newEnemy = new FourEyesBug(spawnPos.x, spawnPos.y);
        newEnemy.textureId = this.TextureRepository.FourEyesBug;
        break;
      default:
        throw new Error(`Invalid enemy type: ${enemy}`);
    }

    newEnemy.id = this.id_counter++;
    this.enemies.push(newEnemy);

    return newEnemy;
  }

  removeEnemy(enemy: Enemy): void {
    const i = this.enemies.findIndex((e) => e.id === enemy.id);
    if (i > -1) {
      this.enemies.splice(i, 1);
    }
  }

  update(deltaTime: number): void {
    for (let i = 0; i < this.enemies.length; i++) {
      this.enemies[i].update(deltaTime);
    }
  }

  fixedUpdate(fixedDeltaTime: number, player: Player): void {
    for (let i = 0; i < this.enemies.length; i++) {
      this.enemies[i].setDirection(player.position);
      this.enemies[i].fixedUpdate(fixedDeltaTime);
      this.collisionSystem.insert(this.enemies[i]);
    }
  }

  render(): void {
    const screenBox2 = Camera2D.getClippingAABB();
    const query: Rectangle = new Rectangle({
      x: screenBox2.min.x,
      y: screenBox2.min.y,
      width: screenBox2.max.x - screenBox2.min.x,
      height: screenBox2.max.y - screenBox2.min.y,
    });

    this.collisionSystem.query(query).forEach((collidable) => {
      const enemy = collidable as Enemy;
      const shouldFlipX = enemy.direction.x == -1;
      const currentTileX = enemy.tileIndex * enemy.tileSize.x;
      const startX = currentTileX;
      const endX = startX + enemy.tileSize.x;
      const startY = 0;
      const endY = enemy.tileSize.y;

      const enemySprite =
        TextureManager.getInstance<TextureManager>().getTexture(
          enemy.textureId
        );

      enemySprite.startx = shouldFlipX ? endX : startX;
      enemySprite.endx = shouldFlipX ? startX : endX;
      enemySprite.starty = startY;
      enemySprite.endy = endY;
      enemySprite.width = enemy.tileSize.x;
      enemySprite.height = enemy.tileSize.y;

      const position = Camera2D.toScreenSpace(enemy.position) // Convert to screen space
        .sub(enemy.tileSize.clone().divideScalar(2)); // Center the sprite

      enemySprite.draw(position.x, position.y);
    });
  }

  clearAll(): void {
    this.enemies = [];
  }

  private getRandomPositionAtScreemBorder = (
    minX: number,
    maxX: number,
    minY: number,
    maxY: number,
    padding: number
  ): Vector2 => {
    const paddedMinX = minX - padding;
    const paddedMaxX = maxX + padding;
    const paddedMinY = minY - padding;
    const paddedMaxY = maxY + padding;

    const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
    let x = paddedMinX,
      y = paddedMinY;

    switch (side) {
      case 0: // Top border (with padding)
        x = Math.random() * (paddedMaxX - paddedMinX) + paddedMinX;
        y = paddedMinY;
        break;
      case 1: // Right border (with padding)
        x = paddedMaxX;
        y = Math.random() * (paddedMaxY - paddedMinY) + paddedMinY;
        break;
      case 2: // Bottom border (with padding)
        x = Math.random() * (paddedMaxX - paddedMinX) + paddedMinX;
        y = paddedMaxY;
        break;
      case 3: // Left border (with padding)
        x = paddedMinX;
        y = Math.random() * (paddedMaxY - paddedMinY) + paddedMinY;
        break;
    }

    return new Vector2(x, y);
  };

  public getRandonEnemy(): Enemy | null {
    if (this.enemies.length == 0) return null;
    const randIndex = randInt(0, this.enemiesCounter - 1);
    return this.enemies[randIndex];
  }
}
