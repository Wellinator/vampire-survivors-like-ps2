import { Vector2, Box2 } from "threejs-math";
import { g_Pad } from "./pad";
import TextureManager from "./texture_manager";
import { Camera2D } from "./camera";
import { Rectangle, Indexable, NodeGeometry } from "@timohausmann/quadtree-ts";
import { Alive } from "./alive.abstract";
import { Entity } from "./entity.abstract";

export class Player extends Entity implements Indexable, Alive {
  public readonly hitboxSize: Vector2 = new Vector2(20, 32);
  public readonly tileSize: Vector2 = new Vector2(32, 32);
  public health: number = 100;
  public maxHealth = 100;
  public texture_atlas!: Image;

  hitBox: Box2 = new Box2(new Vector2(0, 0), new Vector2(0, 0));

  _isMooving: boolean = false;

  constructor() {
    super();

    this.speed = 150;
    this.elapsedAnimationTime = 0;
    this.animationSpeed = 80;

    const tm = TextureManager.getInstance<TextureManager>();
    this.textureId = tm.loadTexture(
      "./assets/sprites/player/kid-male-spritesheet.png"
    );
    this.texture_atlas = tm.getTexture(this.textureId);
  }

  qtIndex(node: NodeGeometry): number[] {
    // The Box should act like a Rectangle
    // so we just call qtIndex on the Rectangle prototype
    // and map the position and size vectors to x, y, width and height
    return Rectangle.prototype.qtIndex.call(
      {
        x: this.position.x,
        y: this.position.y,
        width: this.hitboxSize.x,
        height: this.hitboxSize.y,
      },
      node
    );
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
    this.hitBox.setFromCenterAndSize(this.position.clone(), this.hitboxSize);
  }

  render() {
    const shouldFlipX = this.direction.x == -1;
    const currentTileX = this.tileIndex * this.tileSize.x;

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

    const pos = Camera2D.toScreenSpace(this.position) // Convert to screen space
      .sub(this.tileSize.clone().divideScalar(2)); // Center the sprite
    this.texture_atlas.draw(pos.x, pos.y);
  }

  renderHP() {
    const offset = new Vector2(0, 20);
    const size = new Vector2(22, 5);
    const hpSize = size.clone().subScalar(2);

    // HP border
    const borderPos = Camera2D.toScreenSpace(this.position)
      .add(offset)
      .sub(size.clone().divideScalar(2));
    Draw.rect(
      borderPos.x,
      borderPos.y,
      size.x,
      size.y,
      Color.new(0, 0, 0, 128)
    );

    // HP
    const hpPos = Camera2D.toScreenSpace(this.position)
      .add(offset)
      .sub(hpSize.clone().divideScalar(2));
    const hpWidthByHealth = hpSize.x * (this.health / this.maxHealth);
    Draw.rect(
      hpPos.x,
      hpPos.y,
      hpWidthByHealth,
      hpSize.y,
      Color.new(200, 0, 0, 128)
    );
  }

  renderHitBox() {
    const pos = Camera2D.toScreenSpace(this.hitBox.min.clone()); // Convert to screen space
    Draw.rect(
      pos.x,
      pos.y,
      this.hitboxSize.x,
      this.hitboxSize.y,
      Color.new(255, 0, 0, 128)
    );
  }

  isMooving() {
    return this._isMooving;
  }

  updateSprite() {
    const MAX_IDLE_INDEX = 6;
    const MAX_RUNNING_INDEX = 6;

    this.tileIndex++;

    if (this.isMooving()) {
      this.tileIndex %= MAX_RUNNING_INDEX;

      //Shift right by MAX_IDLE_INDEX
      this.tileIndex += MAX_IDLE_INDEX;
      return;
    }

    this.tileIndex %= MAX_IDLE_INDEX;
  }

  setIdle() {
    this._isMooving = false;
  }

  setRunning() {
    this._isMooving = true;
  }

  // Implements from Alive interface
  public getHealth(): number {
    return this.health;
  }

  public takeDamage(amount: number): void {
    this.health -= amount;
    if (this.health < 0) {
      this.health = 0;
    }
  }

  public isAlive(): boolean {
    return this.health > 0;
  }
}
