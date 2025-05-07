import { NodeGeometry, Rectangle } from "@timohausmann/quadtree-ts";
import { Box2, Vector2 } from "threejs-math";
import { Collidable } from "../controllers/collision.controller";
import { CollidableType } from "../constants";
import { Player } from "../player";

export enum CollectableType {
  Xp,
}

export abstract class Collectable implements Collidable {
  abstract readonly size: Vector2;
  abstract readonly tileSize: Vector2;
  abstract aabb: Box2;

  protected type!: CollectableType;
  protected speed!: number;

  public id: number = -1;
  public textureId: number = -1;
  public collected: boolean = false;
  public collidable_type: CollidableType = CollidableType.Collectable;
  public direction: Vector2 = new Vector2(0, 0);
  public position: Vector2 = new Vector2(0, 0);

  abstract update(deltaTime: number): void;
  abstract fixedUpdate(fixedDeltaTime: number): void;
  abstract onCollect(player: Player): void;

  qtIndex(node: NodeGeometry): number[] {
    return Rectangle.prototype.qtIndex.call(
      {
        x: this.position.x - this.size.x / 2,
        y: this.position.y - this.size.y / 2,
        width: this.size.x,
        height: this.size.y,
      },
      node
    );
  }
}
