import { Vector2, Box2 } from "threejs-math";
import { HALF_SCREEN_VECTOR, SCREEN_VECTOR } from "./scripts/init/init-screen";

class Camera {
  private position: Vector2 = new Vector2(0, 0);
  public readonly screenOffset: Vector2 = new Vector2(
    HALF_SCREEN_VECTOR.x,
    HALF_SCREEN_VECTOR.y
  );

  public setPosition(position: Vector2): void {
    this.position = position;
  }

  public getPosition(): Vector2 {
    return this.position.clone();
  }

  public getHitBox(): Box2 {
    return new Box2(this.position, this.position.clone().add(SCREEN_VECTOR));
  }

  public getClippingAABB(): Box2 {
    const min = this.toWorldSpace(new Vector2(0, 0));
    const max = this.toWorldSpace(SCREEN_VECTOR);
    return new Box2(min, max);
  }

  public toScreenSpace(worldPos: Vector2): Vector2 {
    return worldPos.clone().sub(this.position).add(this.screenOffset);
  }

  public toWorldSpace(screenPos: Vector2): Vector2 {
    return screenPos.clone().sub(this.screenOffset).add(this.position);
  }
}

export const Camera2D = new Camera();
