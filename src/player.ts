import { Vector2, Box2 } from "threejs-math";
import { g_Pad } from "./pad";
import TextureManager from "./texture_manager";
import { g_Camera } from "./camera";

export class Player {
  readonly id: number = 1;

  nodeId: number = -1;

  textureId: number = -1;

  texture_atlas!: Image;

  tile_index: number = 0;

  animationSpeed: number;

  elapsedAnimationTime: number;

  speed: number;

  tileSize: Vector2 = new Vector2(32, 32);

  velocity: Vector2 = new Vector2(0, 0);

  direction: Vector2 = new Vector2(0, 0);

  position: Vector2 = new Vector2(0, 0);

  hitBox: Box2 = new Box2(new Vector2(0, 0), new Vector2(0, 0));

  _isMooving: boolean = false;

  constructor() {
    this.speed = 150;
    this.elapsedAnimationTime = 0;
    this.animationSpeed = 80;

    const tm = TextureManager.getInstance<TextureManager>();
    this.textureId = tm.loadTexture(
      "./assets/sprites/player/kid-male-spritesheet.png"
    );
    this.texture_atlas = tm.getTexture(this.textureId);
  }

  update(deltaTime: number) {
    // Set player idle or running
    g_Pad.lx + g_Pad.ly != 0 ? this.setRunning() : this.setIdle();

    let dirX = 0;
    let dirY = 0;
    if (g_Pad.lx > 0) dirX = 1.0;
    if (g_Pad.lx < 0) dirX = -1.0;
    if (g_Pad.ly > 0) dirY = 1.0;
    if (g_Pad.ly < 0) dirY = -1.0;

    this.direction.x = dirX;
    this.direction.y = dirY;
  }

  fixedUpdate(fixedDeltaTime: number) {
    this.elapsedAnimationTime += fixedDeltaTime;
    if (this.elapsedAnimationTime >= this.animationSpeed) {
      this.updateSprite();
      this.elapsedAnimationTime = 0;
    }

    const deltaPadX = g_Pad.lx / 128.0;
    const deltaPadY = g_Pad.ly / 128.0;

    this.velocity.x = (deltaPadX * this.speed * fixedDeltaTime) / 1000;
    this.velocity.y = (deltaPadY * this.speed * fixedDeltaTime) / 1000;

    this.position = this.position.add(this.velocity);
    this.hitBox.setFromCenterAndSize(this.position.clone(), this.tileSize);
  }

  render() {
    // Draw.rect(
    //   this.hitBox.min.x,
    //   this.hitBox.min.y,
    //   this.tileSize.x,
    //   this.tileSize.y,
    //   Color.new(255, 0, 0, 128)
    // );

    const shouldFlipX = this.direction.x == -1;
    const currentTileX = this.tile_index * this.tileSize.x;

    const startX = currentTileX;
    const endX = startX + this.tileSize.x;
    const startY = 0;
    const endY = this.tileSize.y;

    this.texture_atlas.startx = shouldFlipX ? endX : startX;
    this.texture_atlas.endx = shouldFlipX ? startX : endX;
    this.texture_atlas.starty = startY;
    this.texture_atlas.endy = endY;
    this.texture_atlas.width = this.tileSize.x;
    this.texture_atlas.height = this.tileSize.y;

    const pos = g_Camera
      .toScreenSpace(this.position) // Convert to screen space
      .sub(this.tileSize.clone().divideScalar(2)); // Center the sprite
    this.texture_atlas.draw(pos.x, pos.y);
  }

  isMooving() {
    return this._isMooving;
  }

  updateSprite() {
    const MAX_IDLE_INDEX = 6;
    const MAX_RUNNING_INDEX = 6;

    this.tile_index++;

    if (this.isMooving()) {
      this.tile_index %= MAX_RUNNING_INDEX;

      //Shift right by MAX_IDLE_INDEX
      this.tile_index += MAX_IDLE_INDEX;
      return;
    }

    this.tile_index %= MAX_IDLE_INDEX;
  }

  setIdle() {
    this._isMooving = false;
  }

  setRunning() {
    this._isMooving = true;
  }
}
