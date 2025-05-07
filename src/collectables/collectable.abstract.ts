import { Indexable, NodeGeometry, Rectangle } from "@timohausmann/quadtree-ts";
import { Box2, Vector2 } from "threejs-math";
import { CollidableType } from "../constants";
import { Player } from "../player";

export enum CollectableType {
  Xp,
}

export abstract class Collectable implements Indexable {
  abstract readonly size: Vector2;
  abstract readonly tileSize: Vector2;
  abstract aabb: Box2;

  protected type!: CollectableType;
  protected speed!: number;
  protected maxVelocity: number = 10.0;

  public id: number = -1;
  public textureId: number = -1;
  public collected: boolean = false;
  public attracting: boolean = false;
  public collidable_type: CollidableType = CollidableType.Collectable;
  public velocity: Vector2 = new Vector2(0, 0);
  public direction: Vector2 = new Vector2(0, 0);
  public position: Vector2 = new Vector2(0, 0);

  abstract update(deltaTime: number): void;
  abstract fixedUpdate(fixedDeltaTime: number): void;
  abstract onCollect(player: Player): void;

  public setDirectionFromTarget(target: Vector2): void {
    this.direction.copy(target.clone().sub(this.position).normalize());
  }

  getExpandedAABB(): Box2 {
    return this.aabb.clone().expandByVector(this.velocity);
  }

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
