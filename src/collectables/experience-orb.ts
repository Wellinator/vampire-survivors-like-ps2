import { Box2, Vector2 } from "threejs-math";
import { Collectable, CollectableType } from "./collectable.abstract";
import { Player } from "../player";

export class ExperienceOrb extends Collectable {
  public readonly tileSize: Vector2 = new Vector2(16, 16);
  public readonly size: Vector2 = new Vector2(10, 10);
  public aabb: Box2 = new Box2(new Vector2(0, 0), new Vector2(0, 0));

  constructor(position: Vector2) {
    super();
    this.speed = 5.0;
    this.type = CollectableType.Xp;
    this.position.copy(position);
    this.aabb.setFromCenterAndSize(this.position, this.size);
  }

  update(deltaTime: number): void {}

  fixedUpdate(fixedDeltaTime: number): void {
    const velocity = (this.speed * fixedDeltaTime) / 1000;
    this.position.add(this.direction.clone().multiplyScalar(velocity));
    this.aabb.setFromCenterAndSize(this.position, this.size);
  }

  onCollect(player: Player): void {
    player.onCollectXp(10.0);
  }
}
