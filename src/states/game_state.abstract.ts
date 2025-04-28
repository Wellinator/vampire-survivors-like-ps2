export abstract class GameState {
  constructor() {}

  abstract update(deltaTime: number): void;
  abstract fixedUpdate(fixedDeltaTime: number): void;
  abstract render(): void;
}
