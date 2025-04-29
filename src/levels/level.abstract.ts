export abstract class Level {
  public abstract levelName: string;
  public abstract levelId: number;
  public abstract levelWidth: number;
  public abstract levelHeight: number;

  public abstract render(): void;

  public abstract update(deltaTime: number): void;

  public abstract fixedUpdate(fixedDeltaTime: number): void;
}
