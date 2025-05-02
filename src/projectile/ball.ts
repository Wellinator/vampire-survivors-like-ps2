import TextureManager from "../texture_manager";
import { Vector2, Box2 } from "threejs-math";
import { Rectangle, NodeGeometry } from "@timohausmann/quadtree-ts";
import { Projectile, Projectiles } from "./projectile.abstract";
import { g_Camera } from "../camera";

export class Ball extends Projectile {
  private textureManager = TextureManager.getInstance<TextureManager>();
  readonly tileSize: Vector2 = new Vector2(32, 32);
  readonly halfTileSize: Vector2 = new Vector2(16, 16);
  public size: Vector2 = new Vector2(16, 16);
  public aabb: Box2 = new Box2(new Vector2(0, 0), new Vector2(0, 0));

  constructor(textureId: number, damage: number, range: number, speed: number) {
    super(damage, range, speed);

    this.type = Projectiles.Ball;
    this.textureId = textureId;
  }

  update(deltaTime: number): void {}

  fixedUpdate(fixedDeltaTime: number): void {
    const velocity = (this.speed * fixedDeltaTime) / 1000;
    this.position.add(this.direction.clone().multiplyScalar(velocity));
    this.aabb.setFromCenterAndSize(this.position, this.size);
  }

  draw(): void {
    const texture = this.textureManager.getTexture(this.textureId);
    texture.width = this.tileSize.x;
    texture.height = this.tileSize.y;

    const position = g_Camera
      .toScreenSpace(this.position)
      .sub(this.halfTileSize);
    texture.draw(position.x, position.y);
  }

  qtIndex(node: NodeGeometry): number[] {
    return Rectangle.prototype.qtIndex.call(
      {
        x: this.position.x,
        y: this.position.y,
        width: this.size.x,
        height: this.size.y,
      },
      node
    );
  }
}
