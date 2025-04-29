import { globalPosPad } from "../fake_camera";
import TextureManager from "../texture_manager";
import { Level } from "./level.abstract";

export class Level1 extends Level {
  public levelName: string;
  public levelId: number;
  public levelWidth: number;
  public levelHeight: number;
  public levelBackgroundTexId: number = 0;

  constructor() {
    super();
    this.levelName = "Level 1";
    this.levelId = 1;
    this.levelWidth = 2500;
    this.levelHeight = 2500;

    const textureManager = TextureManager.getInstance<TextureManager>();
    this.levelBackgroundTexId = textureManager.loadTexture("./assets/sprites/levels/level-1/background.png");
    const backGround = TextureManager.getInstance<TextureManager>().getTexture(
      this.levelBackgroundTexId
    );
    backGround.width = this.levelWidth;
    backGround.height = this.levelHeight;
  }

  public render(): void {
    const backGround = TextureManager.getInstance<TextureManager>().getTexture(
      this.levelBackgroundTexId
    );
    backGround.draw(
      -(this.levelWidth / 2) - globalPosPad.x,
      -(this.levelHeight / 2) - globalPosPad.y
    );
  }

  public update(deltaTime: number): void {}

  public fixedUpdate(fixedDeltaTime: number): void {}
}
