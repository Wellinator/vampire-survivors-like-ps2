import { Vector2, Box2 } from "threejs-math";
import { Player } from "../player";
import { g_Camera } from "../camera";
import { Indexable, NodeGeometry, Rectangle } from "@timohausmann/quadtree-ts";

export enum EnemyType {
  Clown,
  DemonDoor,
  Homework,
  FourEyesBug,
  Ghost,
  MaxEnemy,
}

export abstract class Enemy implements Indexable {
  public id: number = -1;
  public nodeId: number = -1;
  public isAlive: boolean = false;
  public textureID: number = 0;
  public tile_index: number = 0;
  public tileSize: Vector2 = new Vector2(0, 0);
  public hitboxSize: Vector2 = new Vector2(0, 0);
  public animationSpeed: number = 500;
  public elapsedAnimationTime: number;
  public speed: number = 50;
  public velocity: Vector2 = new Vector2(0, 0);
  public direction: Vector2 = new Vector2(0, 0);
  public position: Vector2 = new Vector2(0, 0);
  public hitBox: Box2 = new Box2(new Vector2(0, 0), new Vector2(0, 0));

  constructor() {
    this.elapsedAnimationTime = 0;
    this.isAlive = true;
  }

  qtIndex(node: NodeGeometry): number[] {
    // The Box should act like a Rectangle
    // so we just call qtIndex on the Rectangle prototype
    // and map the position and size vectors to x, y, width and height
    return Rectangle.prototype.qtIndex.call(
      {
        x: this.position.x,
        y: this.position.y,
        width: this.hitboxSize.x,
        height: this.hitboxSize.y,
      },
      node
    );
  }

  abstract updateSprite(): void;

  public update(deltaTime: number) {}

  public fixedUpdate(fixedDeltaTime: number, player: Player) {
    this.elapsedAnimationTime += fixedDeltaTime;
    if (this.elapsedAnimationTime >= this.animationSpeed) {
      this.updateSprite();
      this.elapsedAnimationTime = 0;
    }

    // Set enemy direction by player
    this.direction = player.position.clone().sub(this.position).normalize();

    const velocity = (this.speed * fixedDeltaTime) / 1000;
    this.position.add(this.direction.clone().multiplyScalar(velocity));

    // Update hitBox by new position
    this.hitBox.setFromCenterAndSize(this.position, this.hitboxSize);
  }

  public renderHitBox(): void {
    const pos = g_Camera.toScreenSpace(this.hitBox.min.clone()); // Convert to screen space
    Draw.rect(
      pos.x,
      pos.y,
      this.hitboxSize.x,
      this.hitboxSize.y,
      Color.new(255, 0, 0, 128)
    );
  }
}
