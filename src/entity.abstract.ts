import { Vector2 } from "threejs-math";

export abstract class Entity {
  public id: number = -1;
  public textureId: number = -1;
  public tileIndex: number = 0;
  public animationSpeed!: number;
  public elapsedAnimationTime!: number;
  public speed!: number;
  public velocity: Vector2 = new Vector2(0, 0);
  public direction: Vector2 = new Vector2(0, 0);

  protected position_start: Vector2 = new Vector2(0, 0);
  protected position_end: Vector2 = new Vector2(0, 0);
  public position: Vector2 = new Vector2(0, 0);

  abstract readonly tileSize: Vector2;
  abstract readonly hitboxSize: Vector2;

  constructor() {}

  abstract update(deltaTime: number): void;
  abstract fixedUpdate(fixedDeltaTime: number): void;
  abstract render(): void;

  abstract updateSprite(): void;
  abstract renderHitBox(): void;
}
