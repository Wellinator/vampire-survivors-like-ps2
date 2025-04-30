import { Vector2, Box2 } from "threejs-math";
import { g_Canvas, SCREEN_VECTOR } from "./scripts/init/init-screen";

class Camera {
  private position: Vector2 = new Vector2(0, 0);
  public readonly screenOffset: Vector2 = new Vector2(
    g_Canvas.width / 2,
    g_Canvas.height / 2
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

  public toScreenSpace(worldPos: Vector2): Vector2 {
    return worldPos.clone().sub(this.position).add(this.screenOffset);
  }
}

export const g_Camera = new Camera();
